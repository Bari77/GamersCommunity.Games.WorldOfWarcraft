import { Component, input } from "@angular/core";
import { PlayerSummary } from "@features/players/models/player.model";
import { EntityRowComponent } from "@shared/components/entity-row/entity-row.component";

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
