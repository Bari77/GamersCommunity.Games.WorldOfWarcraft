import { Component, computed, effect, inject, input, OnInit, resource, signal, untracked } from "@angular/core";
import { Router } from "@angular/router";
import { SkeletonComponent } from "@bari77/gc-ui";
import {
    parseWorkspace,
    serializeWorkspace,
    WidgetWorkspace,
    WidgetWorkspaceComponent,
} from "@bari77/gc-widgets";
import defaultLayout from "../../../../../../config/guild/workspace.default.json";
import { WOW_GAME_URL } from "@core/constants/game.constants";
import { GameMembershipStore } from "@core/stores/game-membership.store";
import { Character } from "@features/characters/models/character.model";
import { CharactersService } from "@features/characters/services/characters.service";
import { GuildAdminComponent } from "@features/guilds/components/guild-admin/guild-admin.component";
import { GuildApplicationDraft } from "@features/guilds/components/guild-apply-form/guild-apply-form.component";
import { GuildHeroComponent } from "@features/guilds/components/guild-hero/guild-hero.component";
import { RankChange } from "@features/guilds/components/guild-roster/guild-roster.component";
import { GuildUpdateRequestDto } from "@features/guilds/dto/guild.dto";
import { GuildLinkStore } from "@features/guilds/stores/guild-link.store";
import { GuildSheetStore } from "@features/guilds/stores/guild-sheet.store";
import {
    GUILD_PAGE_VISIBILITY_OPTIONS,
    GUILD_WIDGET_CATALOG,
    GUILD_WORKSPACE_COLUMNS,
    GUILD_WORKSPACE_ROW_HEIGHT,
} from "@features/guilds/workspace/widget-catalog";
import { WowGuildWidgetTemplateHostComponent } from "@features/guilds/workspace/widget-template-host.component";
import { NbCardModule } from "@nebular/theme";
import { ResourceUtils } from "@shared/utils/resource.utils";
import { firstValueFrom } from "rxjs";

@Component({
    standalone: true,
    selector: "wow-guild-sheet",
    imports: [
        NbCardModule,
        SkeletonComponent,
        GuildAdminComponent,
        GuildHeroComponent,
        WowGuildWidgetTemplateHostComponent,
        WidgetWorkspaceComponent,
    ],
    providers: [GuildSheetStore, GuildLinkStore],
    templateUrl: "./guild-sheet.component.html",
    styleUrl: "./guild-sheet.component.scss",
})
export class GuildSheetComponent implements OnInit {
    public readonly publicId = input.required<string>();

    public readonly catalog = GUILD_WIDGET_CATALOG;
    public readonly columns = GUILD_WORKSPACE_COLUMNS;
    public readonly rowHeight = GUILD_WORKSPACE_ROW_HEIGHT;
    public readonly pageVisibilityOptions = GUILD_PAGE_VISIBILITY_OPTIONS;

    protected readonly store = inject(GuildSheetStore);
    protected readonly membership = inject(GameMembershipStore);

    /** The page belongs to the leader; officers still get the pencil and the gear. */
    protected readonly canEditLayout = computed(() => this.store.isLeader());

    protected readonly editing = signal(false);
    protected readonly settingsOpen = signal(false);
    protected readonly saveFailed = signal(false);

    /** A saved layout comes back on the refreshed sheet, so the server stays the single source. */
    protected readonly workspace = computed(() =>
        parseWorkspace(
            this.store.sheet()?.layoutJson,
            defaultLayout as WidgetWorkspace,
            GUILD_WORKSPACE_COLUMNS,
            GUILD_WIDGET_CATALOG.map((entry) => entry.type),
        ),
    );

    /** Needed both to apply with a free character and to leave the guild with a member one. */
    private readonly myCharacters = resource({
        params: () => this.membership.playerPublicId() ?? undefined,
        loader: ({ params }) => firstValueFrom(this.characters.listByPlayer(params)),
        defaultValue: [] as Character[],
    });

    protected readonly loadingCharacters = computed(
        () => this.membership.loading() || ResourceUtils.isPending(this.myCharacters),
    );

    protected readonly applyCandidates = computed(() =>
        this.myCharacters.value().filter((character) => character.guildPublicId === null),
    );

    protected readonly myCharacterPublicIds = computed(() =>
        this.myCharacters
            .value()
            .filter((character) => character.guildPublicId === this.publicId())
            .map((character) => character.publicId),
    );

    private readonly characters = inject(CharactersService);
    private readonly router = inject(Router);

    public constructor() {
        effect(() => {
            this.publicId();
            untracked(() => {
                this.editing.set(false);
                this.settingsOpen.set(false);
                this.saveFailed.set(false);
            });
        });
    }

    public async ngOnInit(): Promise<void> {
        await this.store.load(this.publicId());
    }

    protected async onSaveLayout(workspace: WidgetWorkspace): Promise<void> {
        this.saveFailed.set(false);

        if (await this.store.updateProfile({ layoutJson: serializeWorkspace(workspace) })) {
            this.editing.set(false);
        } else {
            this.saveFailed.set(true);
        }
    }

    protected onSave(request: GuildUpdateRequestDto): void {
        void this.store.updateProfile(request);
    }

    protected onSetRank(change: RankChange): void {
        void this.store.setRank(change.characterPublicId, change.rank);
    }

    protected onKick(characterPublicId: string): void {
        void this.store.kick(characterPublicId);
    }

    protected onTransfer(characterPublicId: string): void {
        void this.store.transferLeadership(characterPublicId);
    }

    protected async onLeave(characterPublicId: string): Promise<void> {
        if (await this.store.leave(characterPublicId)) {
            this.myCharacters.reload();
        }
    }

    protected async onApply(draft: GuildApplicationDraft): Promise<void> {
        await this.store.apply(draft.characterPublicId, draft.message);
    }

    protected onWithdraw(): void {
        void this.store.withdrawApplication();
    }

    /** The sheet no longer exists once disbanded, so the visitor lands back on the directory. */
    protected async onDisband(confirmation: string): Promise<void> {
        if (await this.store.disband(confirmation)) {
            await this.router.navigate([`${WOW_GAME_URL}/guilds`]);
        }
    }

    /** An accepted application adds a member, so the roster and the characters must be re-read. */
    protected async onRosterChanged(): Promise<void> {
        await this.store.refresh();
        this.myCharacters.reload();
    }
}
