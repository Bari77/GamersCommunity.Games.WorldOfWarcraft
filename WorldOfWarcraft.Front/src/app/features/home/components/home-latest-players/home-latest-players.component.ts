import { Component, input } from "@angular/core";
import { EntityRowComponent } from "@bari77/gc-ui";
import { PlayerSummary } from "@features/players/models/player.model";

@Component({
    standalone: true,
    selector: "wow-home-latest-players",
    imports: [EntityRowComponent],
    templateUrl: "./home-latest-players.component.html",
    styleUrl: "./home-latest-players.component.scss",
})
export class HomeLatestPlayersComponent {
    public readonly players = input.required<PlayerSummary[]>();

    protected readonly discoverLabel = $localize`:@@wow.home.players.cta:Discover their WoW sheet`;
}
