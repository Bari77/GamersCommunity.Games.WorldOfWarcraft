import { Component, computed, inject, OnInit, resource, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { RichContentComponent, SkeletonComponent, SkeletonTextComponent } from "@bari77/gc-ui";
import { WOW_GAME_URL } from "@core/constants/game.constants";
import { GameMembershipStore } from "@core/stores/game-membership.store";
import { Character, CharacterOptions } from "@features/characters/models/character.model";
import { CharactersService } from "@features/characters/services/characters.service";
import { GuildCreateRequestDto } from "@features/guilds/dto/guild.dto";
import { guildOrientationLabel } from "@features/guilds/models/guild-orientation";
import { GuildApplication } from "@features/guilds/models/guild-application.model";
import { GuildApplicationsService } from "@features/guilds/services/guild-applications.service";
import { GuildCreateFormComponent } from "@features/guilds/components/guild-create-form/guild-create-form.component";
import { GuildsService } from "@features/guilds/services/guilds.service";
import { GuildDirectoryStore } from "@features/guilds/stores/guild-directory.store";
import { NbButtonModule, NbCardModule, NbInputModule, NbSelectModule } from "@nebular/theme";
import { CreateSheetWallComponent } from "@shared/components/create-sheet-wall/create-sheet-wall.component";
import { GuildCrestComponent } from "@shared/components/guild-crest/guild-crest.component";
import { WowIconComponent } from "@shared/components/wow-icon/wow-icon.component";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";
import { ResourceUtils } from "@shared/utils/resource.utils";
import { firstValueFrom } from "rxjs";

const NO_OPTIONS = new CharacterOptions([], [], [], [], [], [], [], 0, 0);

@Component({
    standalone: true,
    selector: "wow-guild-directory",
    imports: [
        FormsModule,
        RouterLink,
        GameTermPipe,
        NbButtonModule,
        NbCardModule,
        NbInputModule,
        NbSelectModule,
        RichContentComponent,
        SkeletonComponent,
        SkeletonTextComponent,
        CreateSheetWallComponent,
        GuildCreateFormComponent,
        GuildCrestComponent,
        WowIconComponent,
    ],
    providers: [GuildDirectoryStore],
    templateUrl: "./guild-directory.component.html",
    styleUrl: "./guild-directory.component.scss",
})
export class GuildDirectoryComponent implements OnInit {
    protected readonly store = inject(GuildDirectoryStore);
    protected readonly membership = inject(GameMembershipStore);

    protected readonly searchPlaceholder = $localize`:@@wow.guild.directory.searchPlaceholder:Guild name or Name#1234`;
    protected readonly sheetWallMessage = $localize`:@@wow.guild.directory.sheetWall:Create your player profile to found a guild or apply to one.`;

    protected readonly guildPlaceholders = [0, 1, 2, 3, 4, 5];

    protected readonly orientationLabel = guildOrientationLabel;

    protected readonly creating = signal(false);
    protected readonly createErrorCode = signal<string | null>(null);
    protected readonly formOpen = signal(false);

    /** Character the visitor came to found with, taken from its card on the player sheet. */
    protected readonly founder = signal<string | null>(null);

    protected readonly options = resource({
        loader: () => firstValueFrom(this.characters.options()),
        defaultValue: NO_OPTIONS,
    });

    protected readonly loadingOptions = computed(() => ResourceUtils.isPending(this.options));

    /** Characters of the visitor, needed both to found a guild and to know none is free. */
    private readonly myCharacters = resource({
        params: () => this.membership.playerPublicId() ?? undefined,
        loader: ({ params }) => firstValueFrom(this.characters.listByPlayer(params)),
        defaultValue: [] as Character[],
    });

    protected readonly candidates = computed(() =>
        this.myCharacters.value().filter((character) => character.guildPublicId === null),
    );

    /** Nothing to found a guild with yet, which is a different dead end from "all already in one". */
    protected readonly noCharacter = computed(() => this.myCharacters.value().length === 0);

    protected readonly sheetLink = `${WOW_GAME_URL}/sheet`;

    protected readonly loadingCandidates = computed(
        () => this.membership.loading() || ResourceUtils.isPending(this.myCharacters),
    );

    /** Applications awaiting an answer, so the visitor does not apply twice to the same guild. */
    protected readonly pendingApplications = computed(() =>
        this.myApplications.value().filter((application) => application.isPending()),
    );

    private readonly applications = inject(GuildApplicationsService);
    private readonly characters = inject(CharactersService);
    private readonly guilds = inject(GuildsService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    private readonly myApplications = resource({
        params: () => this.membership.playerPublicId() ?? undefined,
        loader: () => firstValueFrom(this.applications.listMine()),
        defaultValue: [] as GuildApplication[],
    });

    public async ngOnInit(): Promise<void> {
        const founder = this.route.snapshot.queryParamMap.get("found");
        if (founder) {
            this.founder.set(founder);
            this.formOpen.set(true);
        }

        await this.store.search();
    }

    /** Drops the founder hint from the URL, so a reload does not reopen a form left behind. */
    protected closeForm(): void {
        this.formOpen.set(false);
        this.founder.set(null);

        if (this.route.snapshot.queryParamMap.has("found")) {
            void this.router.navigate([], {
                relativeTo: this.route,
                queryParams: { found: null },
                queryParamsHandling: "merge",
                replaceUrl: true,
            });
        }
    }

    protected applicationLink(application: GuildApplication): string[] {
        return this.guildLink(application.guildPublicId);
    }

    protected onSearchSubmit(): void {
        void this.store.search();
    }

    protected onFilterChange(): void {
        void this.store.search();
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
}
