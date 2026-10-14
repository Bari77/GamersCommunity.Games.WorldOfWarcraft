import { computed, inject, Injectable, signal } from "@angular/core";
import { CharacterSearchRequestDto } from "@features/characters/dto/character-search-request.dto";
import { CharacterSummary } from "@features/characters/models/character-summary.model";
import { CharactersService } from "@features/characters/services/characters.service";
import { GuildSearchRequestDto } from "@features/guilds/dto/guild-search-request.dto";
import { GuildSummary } from "@features/guilds/models/guild-summary.model";
import { GuildsService } from "@features/guilds/services/guilds.service";
import { firstValueFrom } from "rxjs";
import { SearchCriteria } from "../models/search-criteria.model";

export type SearchScope = "all" | "guilds" | "characters";
export const EMPTY_CRITERIA: SearchCriteria = {
    query: "",
    scope: "all",
    idServer: null,
    idAlignment: null,
    idClass: null,
    idRace: null,
    idDirection: null,
    idSpecializationClass: null,
    minLevel: null,
    minIlvl: null,
    orientation: null,
    minMembers: null,
    mainOnly: false,
    inGuild: null,
};

/** First page of each type. Further pages stay on the dedicated tab. */
const PAGE_SIZE = 20;

/**
 * Cross-entity search, one tab per type.
 *
 * Each type keeps the cursor pagination of its own endpoint instead of being merged into a single
 * ranked list, which spares the whole stack a relevance score that has no meaning across guilds
 * and characters.
 */
@Injectable()
export class GlobalSearchStore {
    public readonly guilds = computed(() => this.$guilds());
    public readonly characters = computed(() => this.$characters());

    public readonly loading = computed(() => this.$loading());
    public readonly loadingMore = computed(() => this.$loadingMore());

    /** Only meaningful on a single-type scope; the overview offers "see all" links instead. */
    public readonly hasMore = computed(() => this.$hasMore());

    public readonly criteria = computed(() => this.$criteria());

    public readonly isEmpty = computed(() => this.$guilds().length === 0 && this.$characters().length === 0);

    /**
     * The single guild answering a handle search, which is what typing `Name#1234` asks for.
     * Characters carry no discriminator, so they never shortcut.
     */
    public readonly handleMatch = computed<string | null>(() => {
        const criteria = this.$criteria();
        if (criteria.scope !== "all" || !criteria.query.includes("#")) {
            return null;
        }

        const guilds = this.$guilds();
        return guilds.length === 1 ? guilds[0].publicId : null;
    });

    private readonly charactersService = inject(CharactersService);
    private readonly guildsService = inject(GuildsService);

    /**
     * Search token of the running request. Criteria changed while a page is in flight makes the
     * late answer obsolete, and applying it would show results for a term no longer on screen.
     */
    private token = 0;
    private readonly $guilds = signal<GuildSummary[]>([]);
    private readonly $characters = signal<CharacterSummary[]>([]);
    private readonly $loading = signal(true);
    private readonly $loadingMore = signal(false);
    private readonly $hasMore = signal(false);
    private readonly $criteria = signal<SearchCriteria>(EMPTY_CRITERIA);

    public async search(criteria: SearchCriteria): Promise<void> {
        const current = ++this.token;
        this.$criteria.set(criteria);
        this.$loading.set(true);

        const take = PAGE_SIZE;

        try {
            const [guilds, characters] = await Promise.all([
                this.wants(criteria, "guilds")
                    ? firstValueFrom(this.guildsService.search({ ...this.guildRequest(criteria), take }))
                    : null,
                this.wants(criteria, "characters")
                    ? firstValueFrom(this.charactersService.search({ ...this.characterRequest(criteria), take }))
                    : null,
            ]);

            if (current !== this.token) {
                return;
            }

            this.$guilds.set(guilds?.items ?? []);
            this.$characters.set(characters?.items ?? []);
            this.$hasMore.set(criteria.scope === "all" ? false : (guilds ?? characters)?.hasMore === true);
        } finally {
            if (current === this.token) {
                this.$loading.set(false);
            }
        }
    }

    public async loadMore(): Promise<void> {
        const criteria = this.$criteria();
        if (criteria.scope === "all" || !this.$hasMore() || this.$loadingMore()) {
            return;
        }

        const token = this.token;
        this.$loadingMore.set(true);

        try {
            switch (criteria.scope) {
                case "guilds":
                    await this.appendGuilds(criteria, token);
                    break;
                case "characters":
                    await this.appendCharacters(criteria, token);
                    break;
            }
        } finally {
            this.$loadingMore.set(false);
        }
    }

    private async appendGuilds(criteria: SearchCriteria, token: number): Promise<void> {
        const current = this.$guilds();
        const last = current.at(-1);
        if (!last) {
            return;
        }

        const page = await firstValueFrom(
            this.guildsService.search({
                ...this.guildRequest(criteria),
                take: PAGE_SIZE,
                beforeCreationDate: last.creationDate.toISOString(),
                beforePublicId: last.publicId,
            }),
        );

        if (token !== this.token) {
            return;
        }

        const known = new Set(current.map((item) => item.publicId));
        this.$guilds.set([...current, ...page.items.filter((item) => !known.has(item.publicId))]);
        this.$hasMore.set(page.hasMore);
    }

    private async appendCharacters(criteria: SearchCriteria, token: number): Promise<void> {
        const current = this.$characters();
        const last = current.at(-1);
        if (!last) {
            return;
        }

        const page = await firstValueFrom(
            this.charactersService.search({
                ...this.characterRequest(criteria),
                take: PAGE_SIZE,
                beforeCreationDate: last.creationDate.toISOString(),
                beforePublicId: last.publicId,
            }),
        );

        if (token !== this.token) {
            return;
        }

        const known = new Set(current.map((item) => item.publicId));
        this.$characters.set([...current, ...page.items.filter((item) => !known.has(item.publicId))]);
        this.$hasMore.set(page.hasMore);
    }

    private wants(criteria: SearchCriteria, type: Exclude<SearchScope, "all">): boolean {
        return criteria.scope === "all" || criteria.scope === type;
    }

    private guildRequest(criteria: SearchCriteria): GuildSearchRequestDto {
        const query = criteria.query.trim();
        return {
            ...(query ? { query } : {}),
            ...(criteria.idServer !== null ? { idServer: criteria.idServer } : {}),
            ...(criteria.idAlignment !== null ? { idAlignment: criteria.idAlignment } : {}),
            ...(criteria.orientation ? { orientation: criteria.orientation } : {}),
            ...(criteria.minLevel !== null ? { minLevel: criteria.minLevel } : {}),
            ...(criteria.minMembers !== null ? { minMembers: criteria.minMembers } : {}),
        };
    }

    private characterRequest(criteria: SearchCriteria): CharacterSearchRequestDto {
        const query = criteria.query.trim();
        return {
            ...(query ? { query } : {}),
            ...(criteria.idServer !== null ? { idServer: criteria.idServer } : {}),
            ...(criteria.idAlignment !== null ? { idAlignment: criteria.idAlignment } : {}),
            ...(criteria.idClass !== null ? { idClass: criteria.idClass } : {}),
            ...(criteria.idRace !== null ? { idRace: criteria.idRace } : {}),
            ...(criteria.idDirection !== null ? { idDirection: criteria.idDirection } : {}),
            ...(criteria.idSpecializationClass !== null
                ? { idSpecializationClass: criteria.idSpecializationClass }
                : {}),
            ...(criteria.minLevel !== null ? { minLevel: criteria.minLevel } : {}),
            ...(criteria.minIlvl !== null ? { minIlvl: criteria.minIlvl } : {}),
            ...(criteria.mainOnly ? { mainOnly: true } : {}),
            ...(criteria.inGuild !== null ? { inGuild: criteria.inGuild } : {}),
        };
    }
}
