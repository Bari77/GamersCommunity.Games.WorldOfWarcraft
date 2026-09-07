import { computed, inject, Injectable, resource } from "@angular/core";
import { HomeFeedService } from "@features/home/services/home-feed.service";
import { firstValueFrom } from "rxjs";

@Injectable()
export class HomeFeedStore {
    public readonly feed = resource({
        loader: () => firstValueFrom(this.homeFeedService.get()),
    });

    public readonly loading = computed(() => this.feed.isLoading());

    private readonly homeFeedService = inject(HomeFeedService);

    public reload(): void {
        this.feed.reload();
    }
}
