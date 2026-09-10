import { Component, computed, input, linkedSignal } from "@angular/core";
import { environment } from "environments/environment";

export type WowIconKind = "class" | "race" | "spec" | "role";

const FOLDERS: Record<WowIconKind, string> = {
    class: "classes",
    race: "races",
    spec: "specs",
    role: "roles",
};

/** Role slugs the component draws itself; see the template for why they are not downloaded. */
const ROLE_GLYPHS = ["tank", "healer", "dps"] as const;

type RoleGlyph = (typeof ROLE_GLYPHS)[number];

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

    public readonly glyph = computed<RoleGlyph | null>(() => {
        const slug = this.slug();
        return this.kind() === "role" && ROLE_GLYPHS.includes(slug as RoleGlyph) ? (slug as RoleGlyph) : null;
    });

    public readonly src = computed(() => {
        const slug = this.slug();
        return slug && !this.glyph() ? `${environment.assetsUrl}/wow-icons/${FOLDERS[this.kind()]}/${slug}.jpg` : null;
    });

    /** Icons are fetched by `npm run icons`, so a missing file must degrade silently. */
    protected readonly failed = linkedSignal<string | null, boolean>({
        source: () => this.src(),
        computation: () => false,
    });
}
