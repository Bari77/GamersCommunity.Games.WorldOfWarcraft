import { Component, effect, inject, input, output, signal } from "@angular/core";
import { SkeletonComponent } from "@bari77/gc-ui";
import { CharacterCardComponent } from "@features/characters/components/character-card/character-card.component";
import { CharacterFormComponent } from "@features/characters/components/character-form/character-form.component";
import { CharacterCreateRequestDto, CharacterUpdateRequestDto } from "@features/characters/dto/character.dto";
import { Character } from "@features/characters/models/character.model";
import { CharactersStore } from "@features/characters/stores/characters.store";
import { NbButtonModule, NbIconModule } from "@nebular/theme";

@Component({
    standalone: true,
    selector: "wow-character-list",
    imports: [CharacterCardComponent, CharacterFormComponent, NbButtonModule, NbIconModule, SkeletonComponent],
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

    protected readonly cardPlaceholders = [0, 1, 2];
    protected readonly formFieldPlaceholders = [0, 1, 2, 3, 4, 5];

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

    public async onCreate(data: CharacterCreateRequestDto): Promise<void> {
        this.afterSave(await this.store.create(data));
    }

    public async onUpdate(data: CharacterUpdateRequestDto): Promise<void> {
        const target = this.editing();
        if (target) {
            this.afterSave(await this.store.update(target.publicId, data));
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

    private afterSave(saved: boolean): void {
        if (saved) {
            this.closeForm();
            this.changed.emit();
        }
    }

    private openForm(): void {
        this.store.requestOptions();
        this.store.clearError();
        this.formOpen.set(true);
    }
}
