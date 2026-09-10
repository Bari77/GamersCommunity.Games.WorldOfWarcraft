import { Component, computed, input, output } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Character } from "@features/characters/models/character.model";
import { roleLabel, specKey, specRole } from "@features/characters/models/spec-roles";
import { NbButtonModule, NbIconModule } from "@nebular/theme";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";
import { WowIconComponent, WowIconKind } from "@shared/components/wow-icon/wow-icon.component";

@Component({
    standalone: true,
    selector: "wow-character-card",
    imports: [GameTermPipe, NbButtonModule, NbIconModule, RouterLink, WowIconComponent],
    templateUrl: "./character-card.component.html",
    styleUrl: "./character-card.component.scss",
})
export class CharacterCardComponent {
    public readonly character = input.required<Character>();
    public readonly editable = input(false);

    public readonly edit = output<Character>();
    public readonly remove = output<Character>();

    public readonly specKey = computed(() =>
        specKey(this.character().className, this.character().mainSpecializationName),
    );

    /** Specless characters still deserve a crest, so fall back to the class emblem. */
    public readonly emblem = computed<{ kind: WowIconKind; slug: string | null }>(() => {
        const key = this.specKey();
        return key ? { kind: "spec", slug: key } : { kind: "class", slug: this.character().className };
    });

    public readonly role = computed(() => specRole(this.specKey()));
    public readonly roleName = computed(() => {
        const role = this.role();
        return role ? roleLabel(role) : "";
    });
}
