import { computed, inject, Injectable, signal } from "@angular/core";
import { CharacterSummary } from "@features/characters/models/character.model";
import { CharactersService } from "@features/characters/services/characters.service";
import { GuildSummary } from "@features/guilds/models/guild.model";
import { GuildsService } from "@features/guilds/services/guilds.service";
import { PlayerSummary } from "@features/players/models/player.model";
import { PlayersService } from "@features/players/services/players.service";
import { firstValueFrom } from "rxjs";

export type SearchScope = "all" | "guilds" | "characters" | "players";

export interface SearchCriteria {
    query: string;
    scope: SearchScope;
    idServer: number | null;
    idAlignment: number | null;
    idClass: number | null;
    minLevel: number | null;
}

/** A result the page can jump to directly. Characters have no sheet of their own. */
export interface SearchHit {
    kind: "guild" | "player";
    publicId: string;
}

export const EMPTY_CRITERIA: SearchCriteria = {
    query: "",
    scope: "all",
    idServer: null,
    idAlignment: null,
    idClass: null,
    minLevel: null,
};

/** Rows per type on the overview, which hands over to a dedicated tab rather than paginating. */
const OVERVIEW_TAKE = 3;
const PAGE_SIZE = 20;

/**
 * Cross-entity search, one tab per type.
 *
 * Each type keeps the cursor pagination of its own endpoint instead of being merged into a single
 * ranked list, which spares the whole stack a relevance score that has no meaning across guilds,
 * characters and players.
 */
@Injectable()
export class GlobalSearchStore {
    public readonly guilds = signal<GuildSummary[]>([]);
    public readonly characters = signal<CharacterSummary[]>([]);
    public readonly players = signal<PlayerSummary[]>([]);

    public readonly loading = signal(true);
    public readonly loadingMore = signal(false);

    /** Only meaningful on a single-type scope; the overview offers "see all" links instead. */
    public readonly hasMore = signal(false);

    public readonly criteria = signal<SearchCriteria>(EMPTY_CRITERIA);

    public readonly isEmpty = computed(
        () => this.guilds().length === 0 && this.characters().length === 0 && this.players().length === 0,
    );

    /**
     * The single guild or player answering a handle search, which is what typing `Name#1234` asks
     * for. Characters carry no discriminator, so they never shortcut.
     */
    public readonly handleMatch = computed<SearchHit | null>(() => {
        const criteria = this.criteria();
        if (criteria.scope !== "all" || !criteria.query.includes("#")) {
            return null;
        }

        const guilds = this.guilds();
        const players = this.players();
        if (guilds.length + players.length !== 1) {
            return null;
        }

        return guilds.length === 1
            ? { kind: "guild", publicId: guilds[0].publicId }
            : { kind: "player", publicId: players[0].publicId };
    });

    private readonly charactersService = inject(CharactersService);
    private readonly guildsService = inject(GuildsService);
    private readonly playersService = inject(PlayersService);

    /**
     * Search token of the running request. Criteria changed while a page is in flight makes the
     * late answer obsolete, and applying it would show results for a term no longer on screen.
     */
    private token = 0;

    public async search(criteria: SearchCriteria): Promise<void> {
        const current = ++this.token;
        this.criteria.set(criteria);
        this.loading.set(true);

        const take = criteria.scope === "all" ? OVERVIEW_TAKE : PAGE_SIZE;

        try {
            const [guilds, characters, players] = await Promise.all([
                this.wants(criteria, "guilds")
                    ? firstValueFrom(this.guildsService.search({ ...this.guildRequest(criteria), take }))
                    : null,
                this.wants(criteria, "characters")
                    ? firstValueFrom(this.charactersService.search({ ...this.characterRequest(criteria), take }))
                    : null,
                this.wants(criteria, "players")
                    ? firstValueFrom(this.playersService.search({ ...this.playerRequest(criteria), take }))
                    : null,
            ]);

            if (current !== this.token) {
                return;
            }

            this.guilds.set(guilds?.items ?? []);
            this.characters.set(characters?.items ?? []);
            this.players.set(players?.items ?? []);
            this.hasMore.set(
                criteria.scope === "all" ? false : (guilds ?? characters ?? players)?.hasMore === true,
            );
        } finally {
            if (current === this.token) {
                this.loading.set(false);
            }
        }
    }

    public async loadMore(): Promise<void> {
        const criteria = this.criteria();
        if (criteria.scope === "all" || !this.hasMore() || this.loadingMore()) {
            return;
        }

        const token = this.token;
        this.loadingMore.set(true);

        try {
            switch (criteria.scope) {
                case "guilds":
                    await this.appendGuilds(criteria, token);
                    break;
                case "characters":
                    await this.appendCharacters(criteria, token);
                    break;
                case "players":
                    await this.appendPlayers(criteria, token);
                    break;
            }
        } finally {
            this.loadingMore.set(false);
        }
    }

    private async appendGuilds(criteria: SearchCriteria, token: number): Promise<void> {
        const current = this.guilds();
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
        this.guilds.set([...current, ...page.items.filter((item) => !known.has(item.publicId))]);
        this.hasMore.set(page.hasMore);
    }

    private async appendCharacters(criteria: SearchCriteria, token: number): Promise<void> {
        const current = this.characters();
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
        this.characters.set([...current, ...page.items.filter((item) => !known.has(item.publicId))]);
        this.hasMore.set(page.hasMore);
    }

    private async appendPlayers(criteria: SearchCriteria, token: number): Promise<void> {
        const current = this.players();
        const last = current.at(-1);
        if (!last) {
            return;
        }

        const page = await firstValueFrom(
            this.playersService.search({
                ...this.playerRequest(criteria),
                take: PAGE_SIZE,
                beforeCreationDate: last.creationDate.toISOString(),
                beforePublicId: last.publicId,
            }),
        );

        if (token !== this.token) {
            return;
        }

        const known = new Set(current.map((item) => item.publicId));
        this.players.set([...current, ...page.items.filter((item) => !known.has(item.publicId))]);
        this.hasMore.set(page.hasMore);
    }

    private wants(criteria: SearchCriteria, type: Exclude<SearchScope, "all">): boolean {
        return criteria.scope === "all" || criteria.scope === type;
    }

    private guildRequest(criteria: SearchCriteria) {
        const query = criteria.query.trim();
        return {
            ...(query ? { query } : {}),
            ...(criteria.idServer !== null ? { idServer: criteria.idServer } : {}),
            ...(criteria.idAlignment !== null ? { idAlignment: criteria.idAlignment } : {}),
        };
    }

    private characterRequest(criteria: SearchCriteria) {
        const query = criteria.query.trim();
        return {
            ...(query ? { query } : {}),
            ...(criteria.idServer !== null ? { idServer: criteria.idServer } : {}),
            ...(criteria.idAlignment !== null ? { idAlignment: criteria.idAlignment } : {}),
            ...(criteria.idClass !== null ? { idClass: criteria.idClass } : {}),
            ...(criteria.minLevel !== null ? { minLevel: criteria.minLevel } : {}),
        };
    }

    private playerRequest(criteria: SearchCriteria) {
        const query = criteria.query.trim();
        return {
            ...(query ? { query } : {}),
            ...(criteria.idServer !== null ? { idServer: criteria.idServer } : {}),
        };
    }
}
