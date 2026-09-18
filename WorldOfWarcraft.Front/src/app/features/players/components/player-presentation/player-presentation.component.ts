import { Component, input, output, signal } from "@angular/core";
import { isRichHtmlBlank, RichContentComponent, RichEditorComponent } from "@bari77/gc-ui";
import { NbButtonModule, NbIconModule } from "@nebular/theme";

/** Presentation shown on a player widget, which its owner edits in place. */
@Component({
    standalone: true,
    selector: "wow-player-presentation",
    imports: [RichContentComponent, RichEditorComponent, NbButtonModule, NbIconModule],
    templateUrl: "./player-presentation.component.html",
    styleUrl: "./player-presentation.component.scss",
})
export class PlayerPresentationComponent {
    public readonly text = input<string | null>(null);
    public readonly canEdit = input(false);
    public readonly saving = input(false);

    /** Empty text is sent as null, the only way to clear the presentation. */
    public readonly save = output<string | null>();

    protected readonly editorPlaceholder = $localize`:@@wow.player.presentation.placeholder:Tell others about yourself…`;

    protected readonly editing = signal(false);
    protected readonly draft = signal("");

    protected open(): void {
        this.draft.set(this.text() ?? "");
        this.editing.set(true);
    }

    protected submit(): void {
        const draft = this.draft();
        this.save.emit(isRichHtmlBlank(draft) ? null : draft);
        this.editing.set(false);
    }
}
