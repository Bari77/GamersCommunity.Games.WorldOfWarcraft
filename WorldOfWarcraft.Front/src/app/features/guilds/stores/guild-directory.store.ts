import { computed, inject, Injectable, signal } from "@angular/core";
import { GuildSearchRequestDto } from "@features/guilds/dto/guild.dto";
import { GuildSummary } from "@features/guilds/models/guild.model";
import { GuildsService } from "@features/guilds/services/guilds.service";
import { firstValueFrom } from "rxjs";

const PAGE_SIZE = 20;

@Injectable()
export class GuildDirectoryStore {
    public readonly guilds = signal<GuildSummary[]>([]);
    public readonly loading = signal(true);
    public readonly loadingMore = signal(false);
    public readonly hasMore = signal(false);

    public readonly query = signal("");
    public readonly idServer = signal<number | null>(null);
    public readonly idAlignment = signal<number | null>(null);

    public readonly isFiltered = computed(
        () => this.query().trim().length > 0 || this.idServer() !== null || this.idAlignment() !== null,
    );

    private readonly guildsService = inject(GuildsService);

    /**
     * Search token of the running request. A filter changed while a page is in flight makes the
     * late answer obsolete, and applying it would show results for criteria no longer on screen.
     */
    private token = 0;

    public async search(): Promise<void> {
        const current = ++this.token;
        this.loading.set(true);
        try {
            const page = await firstValueFrom(this.guildsService.search(this.buildRequest()));
            if (current !== this.token) {
                return;
            }
            this.guilds.set(page.items);
            this.hasMore.set(page.hasMore);
        } finally {
            if (current === this.token) {
                this.loading.set(false);
            }
        }
    }

    public async loadMore(): Promise<void> {
        const current = this.guilds();
        const last = current.at(-1);
        if (!this.hasMore() || this.loadingMore() || !last) {
            return;
        }

        const token = this.token;
        this.loadingMore.set(true);
        try {
            const page = await firstValueFrom(
                this.guildsService.search({
                    ...this.buildRequest(),
                    beforeCreationDate: last.creationDate.toISOString(),
                    beforePublicId: last.publicId,
                }),
            );
            if (token !== this.token) {
                return;
            }
            const known = new Set(current.map((guild) => guild.publicId));
            this.guilds.set([...current, ...page.items.filter((guild) => !known.has(guild.publicId))]);
            this.hasMore.set(page.hasMore);
        } finally {
            this.loadingMore.set(false);
        }
    }

    public resetFilters(): void {
        this.query.set("");
        this.idServer.set(null);
        this.idAlignment.set(null);
        void this.search();
    }

    private buildRequest(): GuildSearchRequestDto {
        const query = this.query().trim();
        return {
            take: PAGE_SIZE,
            ...(query ? { query } : {}),
            ...(this.idServer() !== null ? { idServer: this.idServer()! } : {}),
            ...(this.idAlignment() !== null ? { idAlignment: this.idAlignment()! } : {}),
        };
    }
}
