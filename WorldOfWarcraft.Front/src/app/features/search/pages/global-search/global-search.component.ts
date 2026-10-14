import { Component, computed, effect, inject, resource, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router, RouterLink } from "@angular/router";
import { SkeletonComponent, SkeletonTextComponent } from "@bari77/gc-ui";
import { WOW_GAME_URL } from "@core/constants/game.constants";
import { GameMembershipStore } from "@core/stores/game-membership.store";
import { CharacterOptions } from "@features/characters/models/character-options.model";
import { Character } from "@features/characters/models/character.model";
import { CharactersService } from "@features/characters/services/characters.service";
import { GuildCreateFormComponent } from "@features/guilds/components/guild-create-form/guild-create-form.component";
import { GuildCreateRequestDto } from "@features/guilds/dto/guild-create-request.dto";
import { GuildApplication } from "@features/guilds/models/guild-application.model";
import { GUILD_ORIENTATION_OPTIONS, guildOrientationLabel } from "@features/guilds/models/guild-orientation";
import { GuildApplicationsService } from "@features/guilds/services/guild-applications.service";
import { GuildsService } from "@features/guilds/services/guilds.service";
import { SearchCriteria } from "@features/search/models/search-criteria.model";
import { GlobalSearchStore, SearchScope } from "@features/search/stores/global-search.store";
import {
    NbButtonModule,
    NbCardModule,
    NbFormFieldModule,
    NbIconModule,
    NbInputModule,
    NbSelectModule,
} from "@nebular/theme";
import { CreateSheetWallComponent } from "@shared/components/create-sheet-wall/create-sheet-wall.component";
import { GuildCrestComponent } from "@shared/components/guild-crest/guild-crest.component";
import { WowIconComponent } from "@shared/components/wow-icon/wow-icon.component";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";
import { ResourceUtils } from "@shared/utils/resource.utils";
import { firstValueFrom } from "rxjs";

const NO_OPTIONS = new CharacterOptions([], [], [], [], [], [], [], 0, 0);

const SCOPES: readonly SearchScope[] = ["all", "guilds", "characters"];

function readScope(value: string | null): SearchScope {
    return SCOPES.includes(value as SearchScope) ? (value as SearchScope) : "all";
}

function readNumber(value: string | null): number | null {
    if (value === null || value.trim() === "") {
        return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function readPositive(value: string | null): number | null {
    const parsed = readNumber(value);
    return parsed !== null && parsed > 0 ? parsed : null;
}

function coercePositive(value: number | string | null): number | null {
    if (typeof value === "number") {
        return Number.isFinite(value) && value > 0 ? value : null;
    }

    return readPositive(value);
}

function readChoice(value: string | null): boolean | null {
    if (value === "yes") {
        return true;
    }
    if (value === "no") {
        return false;
    }
    return null;
}

function readText(value: string | null): string | null {
    const trimmed = value?.trim() ?? "";
    return trimmed.length > 0 ? trimmed : null;
}

/**
 * Cross-entity search page. The URL is the single source of truth for the criteria, so the shell
 * search bar, the in-page form and a shared link all drive the same code path.
 */
@Component({
    standalone: true,
    selector: "wow-global-search",
    imports: [
        FormsModule,
        RouterLink,
        GameTermPipe,
        NbButtonModule,
        NbCardModule,
        NbFormFieldModule,
        NbIconModule,
        NbInputModule,
        NbSelectModule,
        SkeletonComponent,
        SkeletonTextComponent,
        CreateSheetWallComponent,
        GuildCreateFormComponent,
        GuildCrestComponent,
        WowIconComponent,
    ],
    providers: [GlobalSearchStore],
    templateUrl: "./global-search.component.html",
    styleUrl: "./global-search.component.scss",
})
export class GlobalSearchComponent {
    protected readonly store = inject(GlobalSearchStore);
    protected readonly membership = inject(GameMembershipStore);

    protected readonly searchPlaceholder = $localize`:@@wow.search.placeholder:Name, or Name#1234`;
    protected readonly minLevelPlaceholder = $localize`:@@wow.search.minLevel:Min. level`;
    protected readonly minIlvlPlaceholder = $localize`:@@wow.search.minIlvl:Min. item level`;
    protected readonly minMembersPlaceholder = $localize`:@@wow.search.minMembers:Min. members`;
    protected readonly tabsLabel = $localize`:@@wow.search.tabsLabel:Result type`;
    protected readonly sheetWallMessage = $localize`:@@wow.guild.directory.sheetWall:Create your player profile to found a guild or apply to one.`;
    protected readonly orientationOptions = GUILD_ORIENTATION_OPTIONS;
    protected readonly orientationLabel = guildOrientationLabel;
    protected readonly resultPlaceholders = [0, 1, 2];
    protected readonly sheetLink = `${WOW_GAME_URL}/sheet`;

    /** Bound to the in-page field, which only commits to the URL on submit. */
    protected readonly term = signal("");
    protected readonly moreOpen = signal(false);
    protected readonly creating = signal(false);
    protected readonly createErrorCode = signal<string | null>(null);
    protected readonly formOpen = signal(false);
    protected readonly founder = signal<string | null>(null);

    protected readonly options = resource({
        loader: () => firstValueFrom(this.characters.options()),
        defaultValue: NO_OPTIONS,
    });

    protected readonly loadingOptions = computed(() => ResourceUtils.isPending(this.options));

    /**
     * Nebular drops a value written while only the empty option exists and never retries.
     * Options are rendered once the catalog is actually loaded.
     */
    protected readonly optionsReady = computed(() => this.options.hasValue() && !this.loadingOptions());

    protected readonly scope = computed(() => this.store.criteria().scope);

    protected readonly showsGuilds = computed(() => this.scope() === "all" || this.scope() === "guilds");
    protected readonly showsCharacters = computed(() => this.scope() === "all" || this.scope() === "characters");

    protected readonly specs = computed(() => {
        const idClass = this.store.criteria().idClass;
        const options = this.options.value();
        return idClass === null ? options.specializationClasses : options.specializationsForClass(idClass);
    });

    /** Secondary filters stay behind the toggle unless one of them is already set. */
    protected readonly extraCount = computed(() => {
        const criteria = this.store.criteria();
        const guildsShareTheRow = this.showsGuilds() && this.showsCharacters();
        let count = 0;
        if (criteria.minLevel !== null) {
            count += 1;
        }
        if (this.showsGuilds() && criteria.minMembers !== null) {
            count += 1;
        }
        if (guildsShareTheRow && criteria.orientation !== null) {
            count += 1;
        }
        if (!this.showsCharacters()) {
            return count;
        }
        if (criteria.idRace !== null) {
            count += 1;
        }
        if (criteria.idSpecializationClass !== null) {
            count += 1;
        }
        if (criteria.minIlvl !== null) {
            count += 1;
        }
        if (criteria.inGuild !== null) {
            count += 1;
        }
        if (this.showsCharacters() && criteria.mainOnly) {
            count += 1;
        }
        return count;
    });

    protected readonly showMore = computed(() => this.moreOpen() || (this.extraCount() > 0 && !this.moreDismissed()));

    protected readonly hasFilters = computed(() => {
        const criteria = this.store.criteria();
        return (
            criteria.idServer !== null ||
            criteria.idAlignment !== null ||
            criteria.idClass !== null ||
            criteria.idRace !== null ||
            criteria.idDirection !== null ||
            criteria.idSpecializationClass !== null ||
            criteria.minLevel !== null ||
            criteria.minIlvl !== null ||
            criteria.orientation !== null ||
            criteria.minMembers !== null ||
            criteria.mainOnly ||
            criteria.inGuild !== null
        );
    });

    protected readonly candidates = computed(() =>
        this.myCharacters.value().filter((character) => character.guildPublicId === null),
    );

    protected readonly noCharacter = computed(() => this.myCharacters.value().length === 0);

    protected readonly loadingCandidates = computed(
        () => this.membership.loading() || ResourceUtils.isPending(this.myCharacters),
    );

    protected readonly pendingApplications = computed(() =>
        this.myApplications.hasValue()
            ? this.myApplications.value().filter((application) => application.isPending())
            : [],
    );

    private readonly moreDismissed = signal(false);
    private readonly characters = inject(CharactersService);
    private readonly applications = inject(GuildApplicationsService);
    private readonly guilds = inject(GuildsService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly queryParams = toSignal(this.route.queryParamMap);

    /** Set once the visitor clears a deduced filter, so it does not snap back during this visit. */
    private readonly suppressDefaults = signal(false);

    private readonly viewerCharacters = resource({
        params: () => this.membership.playerPublicId() ?? undefined,
        loader: ({ params }) => firstValueFrom(this.characters.listByPlayer(params)),
    });

    private readonly resetMoreDismissal = effect(() => {
        if (this.extraCount() === 0) {
            this.moreDismissed.set(false);
        }
    });

    private readonly myCharacters = resource({
        params: () =>
            this.formOpen() && this.scope() === "guilds" ? (this.membership.playerPublicId() ?? undefined) : undefined,
        loader: ({ params }) => firstValueFrom(this.characters.listByPlayer(params)),
        defaultValue: [] as Character[],
    });

    private readonly myApplications = resource({
        params: () => (this.scope() === "guilds" ? (this.membership.playerPublicId() ?? undefined) : undefined),
        loader: () => firstValueFrom(this.applications.listMine()),
        defaultValue: [] as GuildApplication[],
    });

    /**
     * The URL stays the source of truth. When it does not name a server yet, and every character
     * of the visitor sits on the same one, that server is written in before the search runs.
     */
    private readonly applyDefaults = effect(() => {
        const params = this.queryParams();
        if (!params) {
            return;
        }

        if (params.get("type") === "players") {
            this.patchCriteria({ type: null });
            return;
        }

        const criteria = this.readCriteria(params);
        this.term.set(criteria.query);
        const founder = params.get("found");
        this.founder.set(founder);
        if (founder && criteria.scope === "guilds") {
            this.formOpen.set(true);
        }

        if (!params.has("server") && !this.suppressDefaults()) {
            const serverId = this.inferredServer();
            if (serverId === undefined) {
                return;
            }
            if (serverId !== null) {
                this.patchCriteria({ server: serverId });
                return;
            }
        }

        void this.runSearch(criteria);
    });

    protected toggleMore(): void {
        const open = !this.showMore();
        this.moreOpen.set(open);
        this.moreDismissed.set(!open);
    }

    protected submitTerm(): void {
        this.patchCriteria({ q: this.term().trim() || null });
    }

    protected setScope(scope: SearchScope): void {
        if (scope !== "guilds") {
            this.formOpen.set(false);
        }
        this.patchCriteria({
            type: scope === "all" ? null : scope,
            ...(scope === "guilds" ? {} : { found: null }),
        });
    }

    protected setServer(idServer: number | null): void {
        if (idServer === null) {
            this.suppressDefaults.set(true);
        }
        this.patchCriteria({ server: idServer });
    }

    protected setAlignment(idAlignment: number | null): void {
        this.patchCriteria({ faction: idAlignment });
    }

    protected setClass(idClass: number | null): void {
        const spec = this.store.criteria().idSpecializationClass;
        const stillValid =
            idClass === null ||
            spec === null ||
            this.options
                .value()
                .specializationsForClass(idClass)
                .some((item) => item.id === spec);
        this.patchCriteria({
            class: idClass,
            ...(stillValid ? {} : { spec: null }),
        });
    }

    protected setRace(idRace: number | null): void {
        this.patchCriteria({ race: idRace });
    }

    protected setDirection(idDirection: number | null): void {
        this.patchCriteria({ role: idDirection });
    }

    protected setSpec(idSpecializationClass: number | null): void {
        this.patchCriteria({ spec: idSpecializationClass });
    }

    protected setMinLevel(value: number | string | null): void {
        this.patchCriteria({ level: coercePositive(value) });
    }

    protected setMinIlvl(value: number | string | null): void {
        this.patchCriteria({ ilvl: coercePositive(value) });
    }

    protected setOrientation(orientation: string | null): void {
        this.patchCriteria({ orientation: orientation || null });
    }

    protected setMinMembers(value: number | string | null): void {
        this.patchCriteria({ members: coercePositive(value) });
    }

    protected setMainOnly(value: string | null): void {
        this.patchCriteria({ main: value === "yes" ? "yes" : null });
    }

    protected setInGuild(value: string | null): void {
        this.patchCriteria({ guild: value === "yes" || value === "no" ? value : null });
    }

    protected mainChoice(): string | null {
        return this.store.criteria().mainOnly ? "yes" : null;
    }

    protected optionById<T extends { id: number }>(items: readonly T[], id: number | null): T | null {
        if (id === null) {
            return null;
        }

        return items.find((item) => item.id === id) ?? null;
    }

    protected orientationIcon(value: string | null): string {
        if (value === "pvp") {
            return "flash-outline";
        }
        if (value === "pvpe") {
            return "shuffle-2-outline";
        }
        return "shield-outline";
    }

    protected guildChoice(): string | null {
        const value = this.store.criteria().inGuild;
        if (value === true) {
            return "yes";
        }
        if (value === false) {
            return "no";
        }
        return null;
    }

    protected clearFilters(): void {
        this.suppressDefaults.set(true);
        this.patchCriteria({
            server: null,
            faction: null,
            class: null,
            race: null,
            role: null,
            spec: null,
            level: null,
            ilvl: null,
            orientation: null,
            members: null,
            main: null,
            guild: null,
        });
    }

    protected closeForm(): void {
        this.formOpen.set(false);
        this.founder.set(null);
        if (this.route.snapshot.queryParamMap.has("found")) {
            this.patchCriteria({ found: null });
        }
    }

    protected async onCreate(request: GuildCreateRequestDto): Promise<void> {
        this.creating.set(true);
        this.createErrorCode.set(null);
        try {
            const sheet = await firstValueFrom(this.guilds.create(request));
            this.formOpen.set(false);
            await this.router.navigate([`${WOW_GAME_URL}/guilds`, sheet.publicId]);
        } catch (err: unknown) {
            this.createErrorCode.set((err as { error?: { Code?: string } })?.error?.Code ?? "UNKNOWN");
        } finally {
            this.creating.set(false);
        }
    }

    protected guildLink(publicId: string): string[] {
        return [`${WOW_GAME_URL}/guilds`, publicId];
    }

    /** A character has no page of its own, so it points at the sheet holding its owner's widgets. */
    protected playerLink(publicId: string): string[] {
        return [`${WOW_GAME_URL}/players`, publicId];
    }

    private async runSearch(criteria: SearchCriteria): Promise<void> {
        await this.store.search(criteria);

        const guildPublicId = this.store.handleMatch();
        if (guildPublicId) {
            await this.router.navigate(this.guildLink(guildPublicId), { replaceUrl: true });
        }
    }

    /**
     * `undefined` while the roster is still loading, `null` when the visitor has no single server.
     */
    private inferredServer(): number | null | undefined {
        if (this.membership.loading()) {
            return undefined;
        }
        if (!this.membership.playerPublicId()) {
            return null;
        }
        if (!this.viewerCharacters.hasValue()) {
            return this.viewerCharacters.status() === "error" ? null : undefined;
        }

        const servers = new Set(this.viewerCharacters.value().map((character) => character.idServer));
        if (servers.size !== 1) {
            return null;
        }
        return [...servers][0];
    }

    private readCriteria(params: ParamMap): SearchCriteria {
        return {
            query: params.get("q") ?? "",
            scope: readScope(params.get("type")),
            idServer: readNumber(params.get("server")),
            idAlignment: readNumber(params.get("faction")),
            idClass: readNumber(params.get("class")),
            idRace: readNumber(params.get("race")),
            idDirection: readNumber(params.get("role")),
            idSpecializationClass: readNumber(params.get("spec")),
            minLevel: readPositive(params.get("level")),
            minIlvl: readPositive(params.get("ilvl")),
            orientation: readText(params.get("orientation")),
            minMembers: readPositive(params.get("members")),
            mainOnly: params.get("main") === "yes",
            inGuild: readChoice(params.get("guild")),
        };
    }

    private patchCriteria(patch: Record<string, string | number | null>): void {
        void this.router.navigate([], {
            relativeTo: this.route,
            queryParams: patch,
            queryParamsHandling: "merge",
            replaceUrl: true,
        });
    }
}
