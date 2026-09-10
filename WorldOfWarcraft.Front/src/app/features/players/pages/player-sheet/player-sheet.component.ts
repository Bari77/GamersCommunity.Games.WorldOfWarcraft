import { DatePipe } from "@angular/common";
import { Component, computed, effect, inject, input, resource, signal, untracked } from "@angular/core";
import { RouterLink } from "@angular/router";
import {
    parseWorkspace,
    serializeWorkspace,
    WidgetDefDirective,
    WidgetSettingsDefDirective,
    WidgetWorkspace,
    WidgetWorkspaceComponent,
} from "@bari77/gc-widgets";
import { GameMembershipStore } from "@core/stores/game-membership.store";
import { CharacterListComponent } from "@features/characters/components/character-list/character-list.component";
import { LinkAdminComponent } from "@features/links/components/link-admin/link-admin.component";
import { LinkBoardComponent } from "@features/links/components/link-board/link-board.component";
import { PlayerLinkStore } from "@features/links/stores/player-link.store";
import { MediaAdminComponent } from "@features/media/components/media-admin/media-admin.component";
import { MediaManagerComponent } from "@features/media/components/media-manager/media-manager.component";
import { PlayerMediaStores } from "@features/media/stores/player-media-stores";
import { PlayerHeroComponent } from "@features/players/components/player-hero/player-hero.component";
import {
    PLAYER_DEFAULT_WORKSPACE,
    PLAYER_WIDGET_CATALOG,
    PLAYER_WIDGETS,
    PLAYER_WORKSPACE_COLUMNS,
    PLAYER_WORKSPACE_ROW_HEIGHT,
} from "@features/players/models/player-workspace";
import { PlayerSheet } from "@features/players/models/player.model";
import { PlayersService } from "@features/players/services/players.service";
import { NbButtonModule } from "@nebular/theme";
import { SkeletonComponent } from "@bari77/gc-ui";
import { firstValueFrom } from "rxjs";

@Component({
    standalone: true,
    selector: "wow-player-sheet",
    imports: [
        CharacterListComponent,
        DatePipe,
        LinkAdminComponent,
        LinkBoardComponent,
        MediaAdminComponent,
        MediaManagerComponent,
        NbButtonModule,
        PlayerHeroComponent,
        RouterLink,
        WidgetDefDirective,
        WidgetSettingsDefDirective,
        WidgetWorkspaceComponent,
        SkeletonComponent,
    ],
    providers: [PlayerMediaStores, PlayerLinkStore],
    templateUrl: "./player-sheet.component.html",
    styleUrl: "./player-sheet.component.scss",
})
export class PlayerSheetComponent {
    public readonly publicId = input.required<string>();

    public readonly catalog = PLAYER_WIDGET_CATALOG;
    public readonly columns = PLAYER_WORKSPACE_COLUMNS;
    public readonly rowHeight = PLAYER_WORKSPACE_ROW_HEIGHT;
    public readonly linksWidget = PLAYER_WIDGETS.links;

    public readonly sheet = resource({
        params: () => this.publicId(),
        loader: ({ params }) => firstValueFrom(this.players.getByPublicId(params)),
        defaultValue: undefined as PlayerSheet | undefined,
    });

    public readonly isOwner = computed(() => {
        const sheet = this.sheet.value();
        const session = this.membership.session();
        return !!sheet && !!session && sheet.platformUserPublicId === session.publicId;
    });

    public readonly editing = signal(false);
    public readonly saving = signal(false);
    public readonly saveFailed = signal(false);

    public readonly workspace = computed(
        () =>
            this.savedWorkspace() ??
            parseWorkspace(
                this.layoutJson(),
                PLAYER_DEFAULT_WORKSPACE,
                PLAYER_WORKSPACE_COLUMNS,
                PLAYER_WIDGET_CATALOG.map((entry) => entry.type),
            ),
    );

    /** Reading the raw layout rather than the sheet keeps a refresh from rebuilding the pages. */
    private readonly layoutJson = computed(() => this.sheet.value()?.layoutJson);

    private readonly savedWorkspace = signal<WidgetWorkspace | null>(null);

    private readonly players = inject(PlayersService);
    private readonly membership = inject(GameMembershipStore);

    public constructor() {
        effect(() => {
            this.publicId();
            untracked(() => {
                this.savedWorkspace.set(null);
                this.editing.set(false);
                this.saveFailed.set(false);
            });
        });
    }

    public onCharactersChanged(): void {
        this.sheet.reload();
    }

    public async onSave(workspace: WidgetWorkspace): Promise<void> {
        const sheet = this.sheet.value();
        if (!sheet) {
            return;
        }

        this.saving.set(true);
        this.saveFailed.set(false);
        try {
            await firstValueFrom(
                this.players.update(sheet.publicId, { layoutJson: serializeWorkspace(workspace) }),
            );
            this.savedWorkspace.set(workspace);
            this.editing.set(false);
        } catch {
            this.saveFailed.set(true);
        } finally {
            this.saving.set(false);
        }
    }
}
