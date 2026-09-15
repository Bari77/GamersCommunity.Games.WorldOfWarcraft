import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
    WORKSPACE_PREVIEW_PENDING_POSTS,
    WORKSPACE_PREVIEW_WALL_POSTS,
} from '@features/guilds/workspace/preview-guild-data';

/** Static guild wall used only by the layout editor for sizing. */
@Component({
    standalone: true,
    selector: 'wow-workspace-preview-wall',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePipe],
    templateUrl: './workspace-preview-wall.component.html',
    styleUrls: [
        '../components/guild-wall/guild-wall.component.scss',
        './workspace-preview-chrome.scss',
        './workspace-preview-wall.component.scss',
    ],
})
export class WorkspacePreviewWallComponent {
    protected readonly pending = WORKSPACE_PREVIEW_PENDING_POSTS;
    protected readonly posts = WORKSPACE_PREVIEW_WALL_POSTS;
}
