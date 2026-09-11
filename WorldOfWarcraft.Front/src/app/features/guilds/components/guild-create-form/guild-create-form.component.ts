import { Component, computed, effect, input, output, signal, untracked } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Character } from "@features/characters/models/character.model";
import { GuildCreateRequestDto } from "@features/guilds/dto/guild.dto";
import { NbButtonModule, NbInputModule, NbSelectModule } from "@nebular/theme";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";

@Component({
    standalone: true,
    selector: "wow-guild-create-form",
    imports: [FormsModule, GameTermPipe, NbButtonModule, NbInputModule, NbSelectModule],
    templateUrl: "./guild-create-form.component.html",
    styleUrl: "./guild-create-form.component.scss",
})
export class GuildCreateFormComponent {
    /** Characters free to found a guild, i.e. the caller's own characters without a membership. */
    public readonly candidates = input.required<Character[]>();
    public readonly saving = input(false);
    public readonly errorCode = input<string | null>(null);

    public readonly create = output<GuildCreateRequestDto>();
    public readonly cancel = output<void>();

    protected readonly entitled = signal("");
    protected readonly founderPublicId = signal<string | null>(null);
    protected readonly sentence = signal("");
    protected readonly linkDiscord = signal("");
    protected readonly linkForum = signal("");

    protected readonly canSave = computed(
        () => !this.saving() && this.entitled().trim().length > 0 && this.founderPublicId() !== null,
    );

    public constructor() {
        // A single free character needs no choice; the founder picker then only states a fact.
        effect(() => {
            const candidates = this.candidates();
            untracked(() => {
                if (candidates.length === 1) {
                    this.founderPublicId.set(candidates[0].publicId);
                } else if (!candidates.some((character) => character.publicId === this.founderPublicId())) {
                    this.founderPublicId.set(null);
                }
            });
        });
    }

    protected submit(): void {
        if (!this.canSave()) {
            return;
        }

        this.create.emit({
            entitled: this.entitled().trim(),
            founderCharacterPublicId: this.founderPublicId()!,
            sentence: this.sentence().trim() || null,
            linkDiscord: this.linkDiscord().trim() || null,
            linkForum: this.linkForum().trim() || null,
        });
    }
}
