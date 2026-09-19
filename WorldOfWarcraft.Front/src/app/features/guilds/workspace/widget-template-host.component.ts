import { DatePipe } from "@angular/common";
import { Component, computed, input, output } from "@angular/core";
import { RichContentComponent } from "@bari77/gc-ui";
import {
    GcGalleryItem,
    LinkListComponent,
    MediaGalleryComponent,
    WidgetDefDirective,
    WidgetSettings,
} from "@bari77/gc-widgets";
import { Character } from "@features/characters/models/character.model";
import { GuildApplicationsComponent } from "@features/guilds/components/guild-applications/guild-applications.component";
import {
    GuildApplicationDraft,
    GuildApplyFormComponent,
} from "@features/guilds/components/guild-apply-form/guild-apply-form.component";
import { GuildLinkAdminComponent } from "@features/guilds/components/guild-link-admin/guild-link-admin.component";
import { GuildLinkBoardComponent } from "@features/guilds/components/guild-link-board/guild-link-board.component";
import { GuildRosterComponent, RankChange } from "@features/guilds/components/guild-roster/guild-roster.component";
import { GuildWallComponent } from "@features/guilds/components/guild-wall/guild-wall.component";
import { CreateSheetWallComponent } from "@shared/components/create-sheet-wall/create-sheet-wall.component";
import { GuildSheet } from "@features/guilds/models/guild.model";
import { WORKSPACE_PREVIEW_GUILD } from "@features/guilds/workspace/preview-guild";
import {
    WORKSPACE_PREVIEW_GUILD_LINKS,
    WORKSPACE_PREVIEW_GUILD_MEMBERS,
    WORKSPACE_PREVIEW_GUILD_PHOTOS,
    WORKSPACE_PREVIEW_GUILD_VIDEOS,
} from "@features/guilds/workspace/preview-guild-data";
import { WorkspacePreviewApplicationsComponent } from "@features/guilds/workspace/workspace-preview-applications.component";
import { WorkspacePreviewApplyComponent } from "@features/guilds/workspace/workspace-preview-apply.component";
import { WorkspacePreviewWallComponent } from "@features/guilds/workspace/workspace-preview-wall.component";

/** Declares every WoW widget template for the guild page and the workspace editor. */
@Component({
    standalone: true,
    selector: "wow-guild-widget-template-host",
    imports: [
        CreateSheetWallComponent,
        DatePipe,
        GuildApplicationsComponent,
        GuildApplyFormComponent,
        GuildLinkAdminComponent,
        GuildLinkBoardComponent,
        GuildRosterComponent,
        GuildWallComponent,
        LinkListComponent,
        MediaGalleryComponent,
        RichContentComponent,
        WidgetDefDirective,
        WorkspacePreviewApplicationsComponent,
        WorkspacePreviewApplyComponent,
        WorkspacePreviewWallComponent,
    ],
    templateUrl: "./widget-template-host.component.html",
    styleUrl: "./widget-template-host.component.scss",
})
export class WowGuildWidgetTemplateHostComponent {
    public readonly preview = input(false);
    public readonly guild = input<GuildSheet | null>(null);
    public readonly editing = input(false);

    /** The visitor's own player, which the wall needs to tell their posts from the others. */
    public readonly playerPublicId = input<string | null>(null);

    public readonly myCharacterPublicIds = input<string[]>([]);
    public readonly busy = input(false);

    public readonly applyCandidates = input<Character[]>([]);
    public readonly applyLoading = input(false);
    public readonly applySaving = input(false);
    public readonly applyErrorCode = input<string | null>(null);

    /** A visitor without a WoW sheet cannot apply at all, so the widget invites them to create one. */
    public readonly needsSheet = input(false);

    public readonly setRank = output<RankChange>();
    public readonly kick = output<string>();
    public readonly transfer = output<string>();
    public readonly leave = output<string>();
    public readonly apply = output<GuildApplicationDraft>();
    public readonly withdraw = output<void>();

    /** Anything that changed the roster: a review, a moderation decision, a departure. */
    public readonly rosterChanged = output<void>();

    protected readonly view = computed(() => this.preview() ? WORKSPACE_PREVIEW_GUILD : this.guild()!);

    protected readonly emptyGalleryLabel = $localize`:@@wow.guild.widget.media.empty:Nothing here yet.`;
    protected readonly sheetWallMessage = $localize`:@@wow.guild.sheetWall:Create your player profile to apply to this guild.`;
    protected readonly previewMembers = WORKSPACE_PREVIEW_GUILD_MEMBERS;
    protected readonly previewViewerRank = WORKSPACE_PREVIEW_GUILD.viewerRank;
    protected readonly previewLinks = WORKSPACE_PREVIEW_GUILD_LINKS;
    protected readonly previewLinksEmpty = $localize`:@@wow.links.empty:No link shared yet.`;
    protected readonly previewPhotos = WORKSPACE_PREVIEW_GUILD_PHOTOS;
    protected readonly previewVideos = WORKSPACE_PREVIEW_GUILD_VIDEOS;

    /**
     * Guild galleries are configured from the widget settings rather than an API, so the leader
     * curates them straight from the layout.
     */
    protected galleryItems(settings: WidgetSettings): GcGalleryItem[] {
        const items = settings["items"];
        if (!Array.isArray(items)) {
            return this.preview() ? this.previewPhotos : [];
        }

        const configured = items
            .map((item) => item as { url?: unknown; title?: unknown })
            .filter((item) => typeof item.url === "string" && item.url.trim().length > 0)
            .map((item) => ({
                url: (item.url as string).trim(),
                title: typeof item.title === "string" ? item.title : null,
            }));

        if (configured.length > 0) {
            return configured;
        }

        return this.preview() ? this.previewPhotos : [];
    }

    protected videoItems(settings: WidgetSettings): GcGalleryItem[] {
        const items = settings["items"];
        if (!Array.isArray(items)) {
            return this.preview() ? this.previewVideos : [];
        }

        const configured = items
            .map((item) => item as { url?: unknown; title?: unknown })
            .filter((item) => typeof item.url === "string" && item.url.trim().length > 0)
            .map((item) => ({
                url: (item.url as string).trim(),
                title: typeof item.title === "string" ? item.title : null,
            }));

        if (configured.length > 0) {
            return configured;
        }

        return this.preview() ? this.previewVideos : [];
    }
}
