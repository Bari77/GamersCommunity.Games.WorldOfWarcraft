import { Component, computed, input } from "@angular/core";
import { GuildCrest } from "@shared/models/guild-crest";
import { environment } from "environments/environment";

const PARTS = `${environment.assetsUrl}/wow-crests`;

const pad = (index: number) => String(index).padStart(2, "0");

/**
 * Guild tabard, layered like the game builds it: faction ring, coloured cloth, hooks, border and
 * emblem. Blizzard ships the shapes as grey silhouettes, so each coloured layer multiplies the
 * artwork with its colour and is clipped to the artwork's own transparency.
 */
@Component({
    standalone: true,
    selector: "wow-guild-crest",
    templateUrl: "./guild-crest.component.html",
    styleUrl: "./guild-crest.component.scss",
})
export class GuildCrestComponent {
    public readonly crest = input.required<GuildCrest>();

    public readonly size = input(96);

    /** Set to expose the crest as an image to assistive technology. */
    public readonly label = input("");

    protected readonly ringUrl = computed(
        () => `${PARTS}/frames/${this.crest().faction === "horde" ? "horde" : "alliance"}.png`,
    );

    protected readonly flagArt = `url(${PARTS}/frames/flag.png)`;

    protected readonly hooksUrl = `${PARTS}/frames/hooks.png`;

    protected readonly borderArt = computed(() => `url(${PARTS}/borders/${pad(this.crest().border)}.png)`);

    protected readonly emblemArt = computed(() => `url(${PARTS}/emblems/${pad(this.crest().emblem)}.png)`);
}
