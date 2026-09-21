import { Component, computed, input, linkedSignal } from "@angular/core";
import { environment } from "environments/environment";

export type WowIconKind = "class" | "race" | "spec" | "role" | "faction";

const FOLDERS: Record<Exclude<WowIconKind, "role" | "faction">, string> = {
    class: "classes",
    race: "races",
    spec: "specs",
};

/** Role glyphs the component draws itself; see the template for why they are not downloaded. */
const ROLE_GLYPHS = ["tank", "healer", "dps"] as const;

type RoleGlyph = (typeof ROLE_GLYPHS)[number];

const FACTION_GLYPHS = ["alliance", "horde"] as const;

type FactionGlyph = (typeof FACTION_GLYPHS)[number];

/** Seeded direction entitled is `heal`; the drawn glyph (and spec roles) use `healer`. */
function asRoleGlyph(slug: string | null | undefined): RoleGlyph | null {
    const key = slug === "heal" ? "healer" : slug;
    return ROLE_GLYPHS.includes(key as RoleGlyph) ? (key as RoleGlyph) : null;
}

function asFactionGlyph(slug: string | null | undefined): FactionGlyph | null {
    return FACTION_GLYPHS.includes(slug as FactionGlyph) ? (slug as FactionGlyph) : null;
}

@Component({
    standalone: true,
    selector: "wow-icon",
    templateUrl: "./wow-icon.component.html",
    styleUrl: "./wow-icon.component.scss",
})
export class WowIconComponent {
    public readonly kind = input.required<WowIconKind>();
    public readonly slug = input<string | null>(null);
    public readonly label = input("");
    public readonly size = input(24);

    public readonly roleGlyph = computed(() => (this.kind() === "role" ? asRoleGlyph(this.slug()) : null));

    public readonly factionGlyph = computed(() => (this.kind() === "faction" ? asFactionGlyph(this.slug()) : null));

    public readonly src = computed(() => {
        const slug = this.slug();
        const kind = this.kind();
        return slug && kind !== "role" && kind !== "faction"
            ? `${environment.assetsUrl}/wow-icons/${FOLDERS[kind]}/${slug}.jpg`
            : null;
    });

    /** Icons are fetched by `npm run icons`, so a missing file must degrade silently. */
    protected readonly failed = linkedSignal<string | null, boolean>({
        source: () => this.src(),
        computation: () => false,
    });
}
