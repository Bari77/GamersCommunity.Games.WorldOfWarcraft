import { Component, computed, effect, inject, input, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { GC_LINK_NETWORKS } from "@bari77/gc-widgets";
import { GuildLink } from "@features/guilds/models/guild-link.model";
import { GuildLinkStore } from "@features/guilds/stores/guild-link.store";
import { NbButtonModule, NbInputModule, NbSelectModule } from "@nebular/theme";

/** Officer-only editor for the guild links widget, rendered inside the widget settings panel. */
@Component({
    standalone: true,
    selector: "wow-guild-link-admin",
    imports: [FormsModule, NbButtonModule, NbInputModule, NbSelectModule],
    templateUrl: "./guild-link-admin.component.html",
    styleUrl: "./guild-link-admin.component.scss",
})
export class GuildLinkAdminComponent {
    public readonly guildPublicId = input.required<string>();

    protected readonly networks = GC_LINK_NETWORKS;
    protected readonly store = inject(GuildLinkStore);
    protected readonly items = computed(() => this.store.items.value());

    /** The edit rows drop the visible captions to stay compact, so screen readers get these. */
    protected readonly labelFieldName = $localize`:@@wow.links.field.label:Label`;
    protected readonly iconFieldName = $localize`:@@wow.links.field.icon:Icon`;

    protected readonly label = signal("");
    protected readonly url = signal("");
    protected readonly icon = signal<string | null>(null);

    protected readonly canAdd = computed(
        () => !this.store.saving() && this.label().trim().length > 0 && this.url().trim().length > 0,
    );

    public constructor() {
        effect(() => this.store.setContext(this.guildPublicId()));
    }

    protected async add(): Promise<void> {
        if (!this.canAdd()) {
            return;
        }

        const created = await this.store.create({
            url: this.url().trim(),
            label: this.label().trim(),
            icon: this.icon(),
        });

        if (created) {
            this.label.set("");
            this.url.set("");
            this.icon.set(null);
        }
    }

    protected editLabel(item: GuildLink, event: Event): void {
        const value = (event.target as HTMLInputElement).value.trim();
        if (value && value !== item.label) {
            this.store.update(item.publicId, { label: value });
        }
    }

    protected editUrl(item: GuildLink, event: Event): void {
        const value = (event.target as HTMLInputElement).value.trim();
        if (value && value !== item.url) {
            this.store.update(item.publicId, { url: value });
        }
    }

    protected editIcon(item: GuildLink, icon: string | null): void {
        if (icon !== item.icon) {
            this.store.update(item.publicId, { icon });
        }
    }
}
