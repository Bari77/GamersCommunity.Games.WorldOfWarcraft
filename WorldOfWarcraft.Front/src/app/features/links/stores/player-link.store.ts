import { computed, inject, Injectable, resource, signal } from "@angular/core";
import { PlayerLinkCreateRequestDto, PlayerLinkUpdateRequestDto } from "@features/links/dto/player-link.dto";
import { PlayerLink } from "@features/links/models/player-link.model";
import { PlayerLinkService } from "@features/links/services/player-link.service";
import { firstValueFrom } from "rxjs";

/**
 * The links a player pinned on their profile. The card list in the grid and the editor behind
 * the gear are two components reading the same list, so provide this on the page hosting them.
 */
@Injectable()
export class PlayerLinkStore {
    public readonly items = resource({
        params: () => this.playerPublicId(),
        loader: ({ params }) => firstValueFrom(this.service.list(params)),
        defaultValue: [] as PlayerLink[],
    });

    public readonly loading = computed(() => this.items.isLoading());
    public readonly saving = signal(false);
    public readonly errorCode = signal<string | null>(null);

    private readonly playerPublicId = signal<string | undefined>(undefined);
    private readonly service = inject(PlayerLinkService);

    public setContext(playerPublicId: string): void {
        this.playerPublicId.set(playerPublicId);
    }

    public clearError(): void {
        this.errorCode.set(null);
    }

    public create(data: PlayerLinkCreateRequestDto): Promise<boolean> {
        return this.run(() => firstValueFrom(this.service.create(data)));
    }

    public update(publicId: string, data: PlayerLinkUpdateRequestDto): Promise<boolean> {
        return this.run(() => firstValueFrom(this.service.update(publicId, data)));
    }

    public remove(publicId: string): Promise<boolean> {
        return this.run(() => firstValueFrom(this.service.remove(publicId)));
    }

    /** Moves one link by `offset` places, keeping the rest of the order untouched. */
    public move(publicId: string, offset: number): Promise<boolean> {
        const order = this.items.value().map((link) => link.publicId);
        const from = order.indexOf(publicId);
        const to = from + offset;
        if (from < 0 || to < 0 || to >= order.length) {
            return Promise.resolve(false);
        }

        order.splice(to, 0, ...order.splice(from, 1));
        return this.run(() => firstValueFrom(this.service.reorder(order)));
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
