import { Component, computed, effect, inject, input } from "@angular/core";
import { LinkListComponent } from "@bari77/gc-widgets";
import { PlayerLinkStore } from "@features/links/stores/player-link.store";

/** Read-only view: the owner sees exactly what visitors see, and edits from the widget gear. */
@Component({
    standalone: true,
    selector: "wow-link-board",
    imports: [LinkListComponent],
    templateUrl: "./link-board.component.html",
    styleUrl: "./link-board.component.scss",
})
export class LinkBoardComponent {
    public readonly playerPublicId = input.required<string>();

    protected readonly emptyLabel = $localize`:@@wow.links.empty:No link shared yet.`;
    protected readonly cards = computed(() => this.store.items.value().map((link) => link.card));

    private readonly store = inject(PlayerLinkStore);

    public constructor() {
        effect(() => this.store.setContext(this.playerPublicId()));
    }
}
