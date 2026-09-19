import { DatePipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LinkListComponent, MediaGalleryComponent, TwitchEmbedComponent, WidgetDefDirective } from '@bari77/gc-widgets';
import { CharacterCardComponent } from '@features/characters/components/character-card/character-card.component';
import { CharacterListComponent } from '@features/characters/components/character-list/character-list.component';
import { LinkAdminComponent } from '@features/links/components/link-admin/link-admin.component';
import { LinkBoardComponent } from '@features/links/components/link-board/link-board.component';
import { MediaAdminComponent } from '@features/media/components/media-admin/media-admin.component';
import { MediaManagerComponent } from '@features/media/components/media-manager/media-manager.component';
import { PlayerPresentationComponent } from '@features/players/components/player-presentation/player-presentation.component';
import { PlayerStatsComponent } from '@features/players/components/player-stats/player-stats.component';
import { PlayerUpdateRequestDto } from '@features/players/dto/player.dto';
import { PlayerSheet } from '@features/players/models/player.model';
import { WORKSPACE_PREVIEW_PLAYER } from '@features/players/workspace/preview-player';
import {
    WORKSPACE_PREVIEW_CHARACTERS,
    WORKSPACE_PREVIEW_LINKS,
    WORKSPACE_PREVIEW_PHOTOS,
    WORKSPACE_PREVIEW_STREAMS,
    WORKSPACE_PREVIEW_VIDEOS,
} from '@features/players/workspace/preview-player-data';
import { NbButtonModule } from '@nebular/theme';

/** Declares every WoW widget template for the player sheet and the workspace editor. */
@Component({
    standalone: true,
    selector: 'wow-widget-template-host',
    imports: [
        CharacterCardComponent,
        CharacterListComponent,
        DatePipe,
        LinkAdminComponent,
        LinkBoardComponent,
        LinkListComponent,
        MediaAdminComponent,
        MediaGalleryComponent,
        MediaManagerComponent,
        NbButtonModule,
        PlayerPresentationComponent,
        PlayerStatsComponent,
        RouterLink,
        TwitchEmbedComponent,
        WidgetDefDirective,
    ],
    templateUrl: './widget-template-host.component.html',
    styleUrl: './widget-template-host.component.scss',
})
export class WowWidgetTemplateHostComponent {
    public readonly preview = input(false);
    public readonly player = input.required<PlayerSheet>();
    public readonly isOwner = input(false);
    public readonly editing = input(false);
    public readonly savingField = input(false);

    public readonly charactersChanged = output<void>();

    /** Patch of the sole fields a widget touched, saved by the page hosting the workspace. */
    public readonly saveField = output<PlayerUpdateRequestDto>();

    protected readonly view = computed(() => (this.preview() ? WORKSPACE_PREVIEW_PLAYER : this.player()));

    protected readonly previewCharacters = WORKSPACE_PREVIEW_CHARACTERS;
    protected readonly previewLinks = WORKSPACE_PREVIEW_LINKS;
    protected readonly previewPhotos = WORKSPACE_PREVIEW_PHOTOS;
    protected readonly previewVideos = WORKSPACE_PREVIEW_VIDEOS;
    protected readonly previewStreams = WORKSPACE_PREVIEW_STREAMS;
    protected readonly previewLinksEmpty = $localize`:@@wow.links.empty:No link shared yet.`;
    protected readonly previewPhotosEmpty = $localize`:@@wow.media.emptyPhoto:No picture shared yet.`;
    protected readonly previewVideosEmpty = $localize`:@@wow.media.emptyVideo:No video shared yet.`;

    /** Rearranging the page is a mode of its own, so field edition steps aside while it lasts. */
    protected readonly canEditFields = computed(() => this.isOwner() && !this.editing() && !this.preview());
}
