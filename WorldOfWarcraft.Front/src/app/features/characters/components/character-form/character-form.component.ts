import { Component, computed, effect, input, output, signal, untracked } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CharacterCreateRequestDto } from "@features/characters/dto/character.dto";
import { Character, CharacterOptions } from "@features/characters/models/character.model";
import { NbButtonModule, NbCheckboxModule, NbInputModule, NbSelectModule } from "@nebular/theme";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";

@Component({
    standalone: true,
    selector: "wow-character-form",
    imports: [FormsModule, GameTermPipe, NbButtonModule, NbCheckboxModule, NbInputModule, NbSelectModule],
    templateUrl: "./character-form.component.html",
    styleUrl: "./character-form.component.scss",
})
export class CharacterFormComponent {
    public readonly options = input.required<CharacterOptions>();
    public readonly character = input<Character | null>(null);
    public readonly saving = input(false);
    public readonly errorCode = input<string | null>(null);

    public readonly save = output<CharacterCreateRequestDto>();
    public readonly cancel = output<void>();

    public readonly pseudo = signal("");
    public readonly idServer = signal<number | null>(null);
    public readonly idRace = signal<number | null>(null);
    public readonly idClass = signal<number | null>(null);
    public readonly idMainSpec = signal<number | null>(null);
    public readonly idSecondarySpec = signal<number | null>(null);
    public readonly idDirection = signal<number | null>(null);
    public readonly idAlignment = signal<number | null>(null);
    public readonly level = signal(1);
    public readonly ilvl = signal(0);
    public readonly achievement = signal(0);
    public readonly sentence = signal("");
    public readonly main = signal(false);

    public readonly availableClasses = computed(() => this.options().classesForRace(this.idRace()));
    public readonly availableSpecs = computed(() => this.options().specializationsForClass(this.idClass()));
    public readonly secondarySpecs = computed(() => this.availableSpecs().filter((spec) => spec.id !== this.idMainSpec()));

    public readonly canSave = computed(
        () =>
            !this.saving() &&
            this.pseudo().trim().length > 0 &&
            this.idServer() !== null &&
            this.idRace() !== null &&
            this.idDirection() !== null &&
            this.level() >= 1 &&
            this.level() <= this.options().maxLevel,
    );

    public constructor() {
        effect(() => {
            const current = this.character();
            untracked(() => this.reset(current));
        });
    }

    public onRaceChange(idRace: number | null): void {
        this.idRace.set(idRace);
        const stillAllowed = this.options()
            .classesForRace(idRace)
            .some((item) => item.id === this.idClass());
        if (!stillAllowed) {
            this.onClassChange(null);
        }
    }

    public onClassChange(idClass: number | null): void {
        this.idClass.set(idClass);
        this.idMainSpec.set(null);
        this.idSecondarySpec.set(null);
    }

    public onMainSpecChange(idMainSpec: number | null): void {
        this.idMainSpec.set(idMainSpec);
        if (this.idSecondarySpec() === idMainSpec) {
            this.idSecondarySpec.set(null);
        }
    }

    public submit(): void {
        if (!this.canSave()) {
            return;
        }

        this.save.emit({
            pseudo: this.pseudo().trim(),
            level: this.level(),
            ilvl: this.ilvl(),
            achievement: this.achievement(),
            sentence: this.sentence().trim() || null,
            main: this.main(),
            idRace: this.idRace()!,
            idServer: this.idServer()!,
            idDirection: this.idDirection()!,
            idAlignment: this.idAlignment(),
            idMainSpecializationClass: this.idMainSpec(),
            idSecondarySpecializationClass: this.idSecondarySpec(),
        });
    }

    private reset(current: Character | null): void {
        this.pseudo.set(current?.pseudo ?? "");
        this.idServer.set(current?.idServer ?? null);
        this.idRace.set(current?.idRace ?? null);
        this.idClass.set(current?.idClass ?? null);
        this.idMainSpec.set(current?.idMainSpecializationClass ?? null);
        this.idSecondarySpec.set(current?.idSecondarySpecializationClass ?? null);
        this.idDirection.set(current?.idDirection ?? null);
        this.idAlignment.set(current?.idAlignment ?? null);
        this.level.set(current?.level ?? 1);
        this.ilvl.set(current?.ilvl ?? 0);
        this.achievement.set(current?.achievement ?? 0);
        this.sentence.set(current?.sentence ?? "");
        this.main.set(current?.main ?? false);
    }
}
