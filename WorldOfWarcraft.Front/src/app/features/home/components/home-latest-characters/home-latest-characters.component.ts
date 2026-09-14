import { Component, input } from "@angular/core";
import { CharacterSummary } from "@features/characters/models/character.model";
import { EntityRowComponent, EntityRowFact, EntityRowIcon } from "@shared/components/entity-row/entity-row.component";
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
    private readonly ilvlLabel = $localize`:@@wow.character.ilvlShort:iLvl`;

    protected subtitle(character: CharacterSummary): string | null {
        if (!character.className) {
            return this.noSpecLabel;
        }

        return character.mainSpecializationName ? gameTerm(character.mainSpecializationName) : null;
    }

    protected subtitleIcons(character: CharacterSummary): EntityRowIcon[] {
        if (!character.className || !character.mainSpecializationName) {
            return [];
        }

        return [
            { kind: "role", slug: character.role(), label: character.roleName() },
            { kind: "spec", slug: character.specKey(), label: gameTerm(character.mainSpecializationName) },
        ];
    }

    protected facts(character: CharacterSummary): EntityRowFact[] {
        const facts: EntityRowFact[] = [
            {
                label: gameTerm(character.raceName),
                icon: { kind: "race", slug: character.raceName, label: gameTerm(character.raceName) },
            },
            { label: gameTerm(character.serverName) },
            { label: String(character.ilvl), prefix: this.ilvlLabel },
        ];

        if (character.guildHandle) {
            facts.push({ label: character.guildHandle, accent: true });
        }

        return facts;
    }
}
