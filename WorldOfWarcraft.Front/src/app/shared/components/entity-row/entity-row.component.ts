import { DatePipe } from "@angular/common";
import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { WowIconComponent, WowIconKind } from "@shared/components/wow-icon/wow-icon.component";

export interface EntityRowIcon {
    kind: WowIconKind;
    slug: string | null;
    label?: string;
}

export interface EntityRowFact {
    label: string;

    /** Muted word printed before the value, as in "iLvl 650". */
    prefix?: string;

    icon?: EntityRowIcon;

    /** Tints the badge with the row accent, used to make a guild handle stand out. */
    accent?: boolean;
}

/**
 * Row shared by the home rails (players, characters, guilds): an accent bar, a leading visual, a
 * title with an optional icon-prefixed subtitle, trailing level/date, and a strip of badges.
 * The leading visual and the trailing artwork are projected because each rail draws its own
 * (avatar, class emblem, guild crest); everything else is data so the three stay in step.
 */
@Component({
    standalone: true,
    selector: "wow-entity-row",
    imports: [DatePipe, RouterLink, WowIconComponent],
    templateUrl: "./entity-row.component.html",
    styleUrl: "./entity-row.component.scss",
})
export class EntityRowComponent {
    public readonly link = input.required<unknown[]>();
    public readonly name = input.required<string>();

    /** Drives the left bar, the title and the accented badges. Falls back to the game accent. */
    public readonly accent = input<string | null>(null);

    public readonly subtitle = input<string | null>(null);

    /** Drawn in order right before the subtitle text, e.g. a role glyph then a spec crest. */
    public readonly subtitleIcons = input<EntityRowIcon[]>([]);

    public readonly subtitleMuted = input(false);

    /** Small uppercase pill above the level, such as a character's "Main". */
    public readonly badge = input<string | null>(null);

    public readonly level = input<number | null>(null);

    /** Screen-reader text for {@link level}, owned by the rail so it keeps its own message id. */
    public readonly levelLabel = input("");

    public readonly date = input<Date | null>(null);

    public readonly facts = input<EntityRowFact[]>([]);

    public readonly description = input<string | null>(null);
    public readonly descriptionMuted = input(false);
}
