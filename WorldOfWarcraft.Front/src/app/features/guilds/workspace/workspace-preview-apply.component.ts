import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WORKSPACE_PREVIEW_APPLY_CANDIDATES } from '@features/guilds/workspace/preview-guild-data';
import { GameTermPipe } from '@shared/pipes/game-term.pipe';

/** Static apply form used only by the layout editor for sizing. */
@Component({
    standalone: true,
    selector: 'wow-workspace-preview-apply',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [GameTermPipe],
    templateUrl: './workspace-preview-apply.component.html',
    styleUrls: [
        '../components/guild-apply-form/guild-apply-form.component.scss',
        './workspace-preview-chrome.scss',
    ],
})
export class WorkspacePreviewApplyComponent {
    protected readonly candidates = WORKSPACE_PREVIEW_APPLY_CANDIDATES;
}
