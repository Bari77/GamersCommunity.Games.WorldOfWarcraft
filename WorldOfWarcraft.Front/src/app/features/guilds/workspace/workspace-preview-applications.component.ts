import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NbButtonModule, NbCardModule } from '@nebular/theme';
import { WORKSPACE_PREVIEW_APPLICATIONS } from '@features/guilds/workspace/preview-guild-data';

/** Static applications queue used only by the layout editor for sizing. */
@Component({
    standalone: true,
    selector: 'wow-workspace-preview-applications',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePipe, NbButtonModule, NbCardModule],
    templateUrl: './workspace-preview-applications.component.html',
    styleUrl: '../components/guild-applications/guild-applications.component.scss',
})
export class WorkspacePreviewApplicationsComponent {
    protected readonly applications = WORKSPACE_PREVIEW_APPLICATIONS;
}
