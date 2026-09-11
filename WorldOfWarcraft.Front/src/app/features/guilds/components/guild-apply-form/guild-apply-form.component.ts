import { Component, computed, effect, input, output, signal, untracked } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Character } from "@features/characters/models/character.model";
import { APPLICATION_PENDING } from "@features/guilds/models/guild-application.model";
import { NbButtonModule, NbCardModule, NbInputModule, NbSelectModule } from "@nebular/theme";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";

export interface GuildApplicationDraft {
    characterPublicId: string;
    message: string;
}

@Component({
    standalone: true,
    selector: "wow-guild-apply-form",
    imports: [FormsModule, GameTermPipe, NbButtonModule, NbCardModule, NbInputModule, NbSelectModule],
    templateUrl: "./guild-apply-form.component.html",
    styleUrl: "./guild-apply-form.component.scss",
})
export class GuildApplyFormComponent {
    /** The visitor's characters without a guild; a guilded one cannot apply anywhere. */
    public readonly candidates = input.required<Character[]>();
    public readonly loading = input(false);
    public readonly saving = input(false);
    public readonly errorCode = input<string | null>(null);

    /** Status of the application already sent to this guild, if any. */
    public readonly pendingStatus = input<string | null>(null);

    public readonly apply = output<GuildApplicationDraft>();
    public readonly withdraw = output<void>();

    protected readonly statusPending = APPLICATION_PENDING;

    protected readonly characterPublicId = signal<string | null>(null);
    protected readonly message = signal("");

    protected readonly canApply = computed(() => !this.saving() && this.characterPublicId() !== null);

    public constructor() {
        effect(() => {
            const candidates = this.candidates();
            untracked(() => {
                if (candidates.length === 1) {
                    this.characterPublicId.set(candidates[0].publicId);
                } else if (!candidates.some((character) => character.publicId === this.characterPublicId())) {
                    this.characterPublicId.set(null);
                }
            });
        });
    }

    protected submit(): void {
        if (!this.canApply()) {
            return;
        }

        this.apply.emit({
            characterPublicId: this.characterPublicId()!,
            message: this.message().trim(),
        });
    }
}
