import { DatePipe } from "@angular/common";
import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { PlayerSummary } from "@features/home/models/home-feed.model";

@Component({
    standalone: true,
    selector: "wow-home-latest-players",
    imports: [DatePipe, RouterLink],
    templateUrl: "./home-latest-players.component.html",
    styleUrl: "./home-latest-players.component.scss",
})
export class HomeLatestPlayersComponent {
    public readonly players = input.required<PlayerSummary[]>();
}
