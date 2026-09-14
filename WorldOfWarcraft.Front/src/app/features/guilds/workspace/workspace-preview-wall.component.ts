import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NbButtonModule, NbCardModule } from '@nebular/theme';
import { WORKSPACE_PREVIEW_WALL_POSTS } from '@features/guilds/workspace/preview-guild-data';

/** Static guild wall used only by the layout editor for sizing. */
@Component({
    standalone: true,
    selector: 'wow-workspace-preview-wall',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePipe, NbButtonModule, NbCardModule],
    templateUrl: './workspace-preview-wall.component.html',
    styleUrl: '../components/guild-wall/guild-wall.component.scss',
})
export class WorkspacePreviewWallComponent {
    protected readonly posts = WORKSPACE_PREVIEW_WALL_POSTS;
}
