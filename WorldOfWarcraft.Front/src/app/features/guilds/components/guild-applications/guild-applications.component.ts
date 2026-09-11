import { DatePipe } from "@angular/common";
import { Component, inject, input, OnInit, output } from "@angular/core";
import { RouterLink } from "@angular/router";
import { SkeletonComponent, SkeletonTextComponent } from "@bari77/gc-ui";
import { GuildApplicationsStore } from "@features/guilds/stores/guild-applications.store";
import { NbButtonModule, NbCardModule } from "@nebular/theme";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";

@Component({
    standalone: true,
    selector: "wow-guild-applications",
    imports: [
        DatePipe,
        RouterLink,
        GameTermPipe,
        NbButtonModule,
        NbCardModule,
        SkeletonComponent,
        SkeletonTextComponent,
    ],
    providers: [GuildApplicationsStore],
    templateUrl: "./guild-applications.component.html",
    styleUrl: "./guild-applications.component.scss",
})
export class GuildApplicationsComponent implements OnInit {
    public readonly guildPublicId = input.required<string>();

    /** Fired after a decision so the sheet can refresh its roster and counters. */
    public readonly reviewed = output<void>();

    protected readonly store = inject(GuildApplicationsStore);

    protected readonly applicationPlaceholders = [0, 1];

    public async ngOnInit(): Promise<void> {
        await this.store.load(this.guildPublicId());
    }

    protected async review(publicId: string, accept: boolean): Promise<void> {
        if (await this.store.review(publicId, accept)) {
            this.reviewed.emit();
        }
    }
}
