import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WORKSPACE_PREVIEW_APPLICATIONS } from '@features/guilds/workspace/preview-guild-data';

/** Static applications queue used only by the layout editor for sizing. */
@Component({
    standalone: true,
    selector: 'wow-workspace-preview-applications',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePipe],
    templateUrl: './workspace-preview-applications.component.html',
    styleUrls: [
        '../components/guild-applications/guild-applications.component.scss',
        './workspace-preview-chrome.scss',
    ],
})
export class WorkspacePreviewApplicationsComponent {
    protected readonly applications = WORKSPACE_PREVIEW_APPLICATIONS;
}
