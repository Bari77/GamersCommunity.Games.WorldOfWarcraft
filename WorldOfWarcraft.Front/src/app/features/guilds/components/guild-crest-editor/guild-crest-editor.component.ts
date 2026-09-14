import { Component, input, output } from "@angular/core";
import { CREST_BORDER_COUNT, CREST_EMBLEM_COUNT, GuildCrest } from "@shared/models/guild-crest";
import { GuildCrestComponent } from "@shared/components/guild-crest/guild-crest.component";
import { environment } from "environments/environment";

const PARTS = `${environment.assetsUrl}/wow-crests`;

interface CrestPart {
    index: number;
    art: string;
}

const parts = (folder: string, count: number): CrestPart[] =>
    Array.from({ length: count }, (_, index) => ({
        index,
        art: `url(${PARTS}/${folder}/${String(index).padStart(2, "0")}.png)`,
    }));

/** Tabard designer: picks the two shapes and the three colours the crest is made of. */
@Component({
    standalone: true,
    selector: "wow-guild-crest-editor",
    imports: [GuildCrestComponent],
    templateUrl: "./guild-crest-editor.component.html",
    styleUrl: "./guild-crest-editor.component.scss",
})
export class GuildCrestEditorComponent {
    public readonly crest = input.required<GuildCrest>();

    public readonly changed = output<GuildCrest>();

    protected readonly emblems = parts("emblems", CREST_EMBLEM_COUNT);
    protected readonly borders = parts("borders", CREST_BORDER_COUNT);

    protected readonly emblemLabel = $localize`:@@wow.guild.crest.emblemOption:Emblem`;
    protected readonly borderLabel = $localize`:@@wow.guild.crest.borderOption:Border`;

    protected pick(changes: Partial<{ emblem: number; border: number }>): void {
        this.changed.emit(this.crest().with(changes));
    }

    protected recolor(part: "emblemColor" | "borderColor" | "backgroundColor", value: string): void {
        this.changed.emit(this.crest().with({ [part]: value }));
    }
}
