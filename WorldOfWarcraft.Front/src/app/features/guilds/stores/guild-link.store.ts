import { computed, inject, Injectable, resource, signal } from "@angular/core";
import { GuildLinkCreateRequestDto, GuildLinkUpdateRequestDto } from "@features/guilds/dto/guild-link.dto";
import { GuildLink } from "@features/guilds/models/guild-link.model";
import { GuildLinkService } from "@features/guilds/services/guild-link.service";
import { firstValueFrom } from "rxjs";

/**
 * The links a guild pinned on its page. The card list in the grid and the editor behind the gear
 * are two components reading the same list, so provide this on the page hosting them.
 */
@Injectable()
export class GuildLinkStore {
    public readonly items = resource({
        params: () => this.guildPublicId(),
        loader: ({ params }) => firstValueFrom(this.service.list(params)),
        defaultValue: [] as GuildLink[],
    });

    public readonly loading = computed(() => this.items.isLoading());
    public readonly saving = signal(false);
    public readonly errorCode = signal<string | null>(null);

    private readonly guildPublicId = signal<string | undefined>(undefined);
    private readonly service = inject(GuildLinkService);

    public setContext(guildPublicId: string): void {
        this.guildPublicId.set(guildPublicId);
    }

    public clearError(): void {
        this.errorCode.set(null);
    }

    public create(data: Omit<GuildLinkCreateRequestDto, "guildPublicId">): Promise<boolean> {
        const guildPublicId = this.guildPublicId();
        if (!guildPublicId) {
            return Promise.resolve(false);
        }

        return this.run(() => firstValueFrom(this.service.create({ ...data, guildPublicId })));
    }

    public update(publicId: string, data: GuildLinkUpdateRequestDto): Promise<boolean> {
        return this.run(() => firstValueFrom(this.service.update(publicId, data)));
    }

    public remove(publicId: string): Promise<boolean> {
        return this.run(() => firstValueFrom(this.service.remove(publicId)));
    }

    /** Moves one link by `offset` places, keeping the rest of the order untouched. */
    public move(publicId: string, offset: number): Promise<boolean> {
        const guildPublicId = this.guildPublicId();
        const order = this.items.value().map((link) => link.publicId);
        const from = order.indexOf(publicId);
        const to = from + offset;
        if (!guildPublicId || from < 0 || to < 0 || to >= order.length) {
            return Promise.resolve(false);
        }

        order.splice(to, 0, ...order.splice(from, 1));
        return this.run(() => firstValueFrom(this.service.reorder(guildPublicId, order)));
    }

    private async run(action: () => Promise<unknown>): Promise<boolean> {
        this.saving.set(true);
        this.errorCode.set(null);
        try {
            await action();
            this.items.reload();
            return true;
        } catch (err: unknown) {
            this.errorCode.set((err as { error?: { Code?: string } })?.error?.Code ?? "UNKNOWN");
            return false;
        } finally {
            this.saving.set(false);
        }
    }
}
