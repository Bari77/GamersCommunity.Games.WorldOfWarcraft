import { inject, Injectable, Injector, runInInjectionContext } from "@angular/core";
import { PlayerMediaKind } from "@features/media/dto/player-media.dto";
import { PlayerMediaStore } from "@features/media/stores/player-media.store";

/**
 * Media belongs to the player, not to a widget: the gallery in the grid and the management
 * panel behind its gear are two components that must read and refresh the same list.
 * Provide this on the page hosting them.
 */
@Injectable()
export class PlayerMediaStores {
    private readonly injector = inject(Injector);

    /**
     * Built up front rather than on demand: a store opens a `resource`, and Angular forbids
     * creating the underlying effect from the computed that reads the store. An untouched
     * store holds no params, so it stays idle until a widget calls `setContext`.
     */
    private readonly stores: Record<PlayerMediaKind, PlayerMediaStore> = {
        photo: this.create(),
        video: this.create(),
        stream: this.create(),
    };

    public for(kind: PlayerMediaKind): PlayerMediaStore {
        return this.stores[kind];
    }

    private create(): PlayerMediaStore {
        return runInInjectionContext(this.injector, () => new PlayerMediaStore());
    }
}
