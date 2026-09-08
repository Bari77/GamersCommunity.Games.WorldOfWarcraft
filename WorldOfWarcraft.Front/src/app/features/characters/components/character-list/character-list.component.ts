import { Component, effect, inject, input, output, signal } from "@angular/core";
import { CharacterCardComponent } from "@features/characters/components/character-card/character-card.component";
import { CharacterFormComponent } from "@features/characters/components/character-form/character-form.component";
import { CharacterCreateRequestDto } from "@features/characters/dto/character.dto";
import { Character } from "@features/characters/models/character.model";
import { CharactersStore } from "@features/characters/stores/characters.store";
import { NbButtonModule, NbIconModule, NbSpinnerModule } from "@nebular/theme";

@Component({
    standalone: true,
    selector: "wow-character-list",
    imports: [CharacterCardComponent, CharacterFormComponent, NbButtonModule, NbIconModule, NbSpinnerModule],
    providers: [CharactersStore],
    templateUrl: "./character-list.component.html",
    styleUrl: "./character-list.component.scss",
})
export class CharacterListComponent {
    public readonly playerPublicId = input.required<string>();
    public readonly editable = input(false);

    public readonly changed = output<void>();

    public readonly store = inject(CharactersStore);
    public readonly formOpen = signal(false);
    public readonly editing = signal<Character | null>(null);
    public readonly pendingDelete = signal<Character | null>(null);

    public constructor() {
        effect(() => this.store.setPlayer(this.playerPublicId()));
    }

    public openCreate(): void {
        this.editing.set(null);
        this.openForm();
    }

    public openEdit(character: Character): void {
        this.editing.set(character);
        this.openForm();
    }

    public closeForm(): void {
        this.formOpen.set(false);
        this.editing.set(null);
        this.store.clearError();
    }

    public async onSave(data: CharacterCreateRequestDto): Promise<void> {
        const target = this.editing();
        const saved = target ? await this.store.update(target.publicId, data) : await this.store.create(data);
        if (saved) {
            this.closeForm();
            this.changed.emit();
        }
    }

    public askDelete(character: Character): void {
        this.store.clearError();
        this.pendingDelete.set(character);
    }

    public cancelDelete(): void {
        this.pendingDelete.set(null);
    }

    public async confirmDelete(): Promise<void> {
        const target = this.pendingDelete();
        if (!target) {
            return;
        }

        if (await this.store.remove(target.publicId)) {
            this.pendingDelete.set(null);
            this.changed.emit();
        }
    }

    private openForm(): void {
        this.store.requestOptions();
        this.store.clearError();
        this.formOpen.set(true);
    }
}
