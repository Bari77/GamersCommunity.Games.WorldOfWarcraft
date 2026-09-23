import { Component, input } from "@angular/core";
import { EntityRowComponent } from "@bari77/gc-ui";
import { CharacterSummary } from "@features/characters/models/character.model";
import { WowIconComponent } from "@shared/components/wow-icon/wow-icon.component";
import { GameTermPipe, gameTerm } from "@shared/pipes/game-term.pipe";

@Component({
    standalone: true,
    selector: "wow-home-latest-characters",
    imports: [GameTermPipe, EntityRowComponent, WowIconComponent],
    templateUrl: "./home-latest-characters.component.html",
    styleUrl: "./home-latest-characters.component.scss",
})
export class HomeLatestCharactersComponent {
    public readonly characters = input.required<CharacterSummary[]>();

    protected readonly levelLabel = $localize`:@@wow.character.level:Level`;
    protected readonly mainLabel = $localize`:@@wow.character.main:Main`;

    private readonly noSpecLabel = $localize`:@@wow.character.noSpec:No specialization`;
    protected readonly ilvlLabel = $localize`:@@wow.character.ilvlShort:iLvl`;

    protected subtitle(character: CharacterSummary): string | null {
        if (!character.className) {
            return this.noSpecLabel;
        }

        const classLabel = gameTerm(character.className);
        return character.mainSpecializationName
            ? `${classLabel} ${gameTerm(character.mainSpecializationName)}`
            : classLabel;
    }

    protected hasSubtitleIcons(character: CharacterSummary): boolean {
        return !!(character.className && character.mainSpecializationName);
    }
}
