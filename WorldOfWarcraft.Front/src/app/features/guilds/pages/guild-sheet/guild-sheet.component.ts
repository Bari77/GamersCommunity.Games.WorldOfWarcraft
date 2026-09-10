import { DatePipe } from "@angular/common";
import { Component, computed, inject, input, resource } from "@angular/core";
import { RouterLink } from "@angular/router";
import { SkeletonComponent, SkeletonTextComponent } from "@bari77/gc-ui";
import { GuildSheet } from "@features/guilds/models/guild.model";
import { GuildSheetService } from "@features/guilds/services/guild-sheet.service";
import { ResourceUtils } from "@shared/utils/resource.utils";
import { NbButtonModule, NbCardModule } from "@nebular/theme";
import { firstValueFrom } from "rxjs";

@Component({
    standalone: true,
    selector: "wow-guild-sheet",
    imports: [DatePipe, NbCardModule, NbButtonModule, RouterLink, SkeletonComponent, SkeletonTextComponent],
    templateUrl: "./guild-sheet.component.html",
    styleUrl: "./guild-sheet.component.scss",
})
export class GuildSheetComponent {
    public readonly publicId = input.required<string>();

    public readonly sheet = resource({
        params: () => this.publicId(),
        loader: ({ params }) => firstValueFrom(this.guilds.getByPublicId(params)),
        defaultValue: undefined as GuildSheet | undefined,
    });

    protected readonly loading = computed(() => ResourceUtils.isPending(this.sheet));

    protected readonly memberPlaceholders = [0, 1, 2, 3];

    private readonly guilds = inject(GuildSheetService);
}
