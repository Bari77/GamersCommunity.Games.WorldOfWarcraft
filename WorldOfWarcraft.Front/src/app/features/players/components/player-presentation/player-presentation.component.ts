import { Component, input, output, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NbButtonModule, NbIconModule, NbInputModule } from "@nebular/theme";

/** Presentation shown on a player widget, which its owner edits in place. */
@Component({
    standalone: true,
    selector: "wow-player-presentation",
    imports: [FormsModule, NbButtonModule, NbIconModule, NbInputModule],
    templateUrl: "./player-presentation.component.html",
    styleUrl: "./player-presentation.component.scss",
})
export class PlayerPresentationComponent {
    public readonly text = input<string | null>(null);
    public readonly canEdit = input(false);
    public readonly saving = input(false);

    /** Empty text is sent as null, the only way to clear the presentation. */
    public readonly save = output<string | null>();

    protected readonly editing = signal(false);
    protected readonly draft = signal("");

    protected open(): void {
        this.draft.set(this.text() ?? "");
        this.editing.set(true);
    }

    protected submit(): void {
        this.save.emit(this.draft().trim() || null);
        this.editing.set(false);
    }
}
