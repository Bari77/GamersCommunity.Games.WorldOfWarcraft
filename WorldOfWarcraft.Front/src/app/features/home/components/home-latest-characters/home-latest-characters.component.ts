import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CharacterSummary } from "@features/home/models/home-feed.model";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";
import { WowIconComponent } from "@shared/components/wow-icon/wow-icon.component";

@Component({
    standalone: true,
    selector: "wow-home-latest-characters",
    imports: [GameTermPipe, RouterLink, WowIconComponent],
    templateUrl: "./home-latest-characters.component.html",
    styleUrl: "./home-latest-characters.component.scss",
})
export class HomeLatestCharactersComponent {
    public readonly characters = input.required<CharacterSummary[]>();
}
