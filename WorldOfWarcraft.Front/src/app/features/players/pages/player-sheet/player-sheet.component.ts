import { DatePipe } from "@angular/common";
import { Component, inject, input, resource } from "@angular/core";
import { RouterLink } from "@angular/router";
import { PlayerSheet } from "@features/players/models/player.model";
import { PlayersService } from "@features/players/services/players.service";
import { NbButtonModule, NbCardModule, NbSpinnerModule } from "@nebular/theme";
import { firstValueFrom } from "rxjs";

@Component({
    standalone: true,
    selector: "wow-player-sheet",
    imports: [DatePipe, NbCardModule, NbButtonModule, NbSpinnerModule, RouterLink],
    templateUrl: "./player-sheet.component.html",
    styleUrl: "./player-sheet.component.scss",
})
export class PlayerSheetComponent {
    public readonly publicId = input.required<string>();

    public readonly sheet = resource({
        params: () => this.publicId(),
        loader: ({ params }) => firstValueFrom(this.players.getByPublicId(params)),
        defaultValue: undefined as PlayerSheet | undefined,
    });

    private readonly players = inject(PlayersService);
}
