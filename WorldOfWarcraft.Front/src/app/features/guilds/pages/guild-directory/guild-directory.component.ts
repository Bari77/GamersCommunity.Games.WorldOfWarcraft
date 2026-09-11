import { Component, computed, inject, OnInit, resource, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { SkeletonComponent, SkeletonTextComponent } from "@bari77/gc-ui";
import { WOW_GAME_URL } from "@core/constants/game.constants";
import { GameMembershipStore } from "@core/stores/game-membership.store";
import { Character, CharacterOptions } from "@features/characters/models/character.model";
import { CharactersService } from "@features/characters/services/characters.service";
import { GuildCreateRequestDto } from "@features/guilds/dto/guild.dto";
import { GuildCreateFormComponent } from "@features/guilds/components/guild-create-form/guild-create-form.component";
import { GuildsService } from "@features/guilds/services/guilds.service";
import { GuildDirectoryStore } from "@features/guilds/stores/guild-directory.store";
import { NbButtonModule, NbCardModule, NbInputModule, NbSelectModule } from "@nebular/theme";
import { CreateSheetWallComponent } from "@shared/components/create-sheet-wall/create-sheet-wall.component";
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
        SkeletonComponent,
        SkeletonTextComponent,
        CreateSheetWallComponent,
        GuildCreateFormComponent,
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

    protected readonly creating = signal(false);
    protected readonly createErrorCode = signal<string | null>(null);
    protected readonly formOpen = signal(false);

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

    protected readonly loadingCandidates = computed(
        () => this.membership.loading() || ResourceUtils.isPending(this.myCharacters),
    );

    /** Every character already belongs to a guild, so founding one needs a new character first. */
    protected readonly noFreeCharacter = computed(
        () => this.membership.hasSheet() && !this.loadingCandidates() && this.candidates().length === 0,
    );

    private readonly characters = inject(CharactersService);
    private readonly guilds = inject(GuildsService);
    private readonly router = inject(Router);

    public async ngOnInit(): Promise<void> {
        await this.store.search();
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
