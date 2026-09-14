import { Component, computed, effect, inject, input } from "@angular/core";
import { LinkListComponent } from "@bari77/gc-widgets";
import { GuildLinkStore } from "@features/guilds/stores/guild-link.store";

/** Read-only view: officers see exactly what visitors see, and edit from the widget gear. */
@Component({
    standalone: true,
    selector: "wow-guild-link-board",
    imports: [LinkListComponent],
    template: `<gc-link-list [links]="cards()" [emptyLabel]="emptyLabel" />`,
})
export class GuildLinkBoardComponent {
    public readonly guildPublicId = input.required<string>();

    protected readonly emptyLabel = $localize`:@@wow.guild.links.empty:No link shared yet.`;
    protected readonly cards = computed(() => this.store.items.value().map((link) => link.card));

    private readonly store = inject(GuildLinkStore);

    public constructor() {
        effect(() => this.store.setContext(this.guildPublicId()));
    }
}
