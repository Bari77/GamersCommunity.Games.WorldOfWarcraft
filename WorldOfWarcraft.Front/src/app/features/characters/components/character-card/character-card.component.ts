import { Component, input, output } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Character } from "@features/characters/models/character.model";
import { NbButtonModule, NbIconModule } from "@nebular/theme";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";

@Component({
    standalone: true,
    selector: "wow-character-card",
    imports: [GameTermPipe, NbButtonModule, NbIconModule, RouterLink],
    templateUrl: "./character-card.component.html",
    styleUrl: "./character-card.component.scss",
})
export class CharacterCardComponent {
    public readonly character = input.required<Character>();
    public readonly editable = input(false);

    public readonly edit = output<Character>();
    public readonly remove = output<Character>();
}
