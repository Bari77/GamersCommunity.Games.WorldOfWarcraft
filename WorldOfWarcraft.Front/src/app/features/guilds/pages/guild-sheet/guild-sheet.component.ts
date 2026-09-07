import { DatePipe } from "@angular/common";
import { Component, inject, input, resource } from "@angular/core";
import { RouterLink } from "@angular/router";
import { GuildSheet } from "@features/guilds/models/guild.model";
import { GuildSheetService } from "@features/guilds/services/guild-sheet.service";
import { NbButtonModule, NbCardModule, NbSpinnerModule } from "@nebular/theme";
import { firstValueFrom } from "rxjs";

@Component({
    standalone: true,
    selector: "wow-guild-sheet",
    imports: [DatePipe, NbCardModule, NbButtonModule, NbSpinnerModule, RouterLink],
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

    private readonly guilds = inject(GuildSheetService);
}
