import { DatePipe } from "@angular/common";
import { Component, computed, ElementRef, HostListener, inject, input, resource, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { WOW_GAME_URL } from "@core/constants/game.constants";
import { PlatformGame, PlatformGamesService } from "@core/services/platform-games.service";
import { PlayerSheet } from "@features/players/models/player.model";
import { firstValueFrom } from "rxjs";

@Component({
    standalone: true,
    selector: "wow-player-hero",
    imports: [DatePipe, RouterLink],
    templateUrl: "./player-hero.component.html",
    styleUrl: "./player-hero.component.scss",
})
export class PlayerHeroComponent {
    public readonly player = input.required<PlayerSheet>();

    protected readonly switchLabel = $localize`:@@wow.player.hero.switch:Switch to another game`;
    protected readonly unavailableLabel = $localize`:@@wow.player.hero.unavailable:Temporarily unavailable`;
    protected readonly gameNameFallback = $localize`:@@wow.game.name:World of Warcraft`;
    protected readonly menuOpen = signal(false);

    /** The identity snapshot arrives through a Platform event, which may lag a fresh sheet. */
    public readonly handle = computed(
        () => this.player().handle || $localize`:@@wow.player.hero.unknown:Unknown player`,
    );

    public readonly games = resource({
        params: () => this.player().platformUserPublicId,
        loader: ({ params }) => firstValueFrom(this.platformGames.listForPlayer(params)).catch(() => []),
        defaultValue: [],
    });

    public readonly currentGame = computed(() => this.games.value().find((game) => game.url === WOW_GAME_URL));
    public readonly otherGames = computed(() => this.games.value().filter((game) => game.url !== WOW_GAME_URL));
    public readonly canSwitch = computed(() => this.otherGames().length > 0);

    private readonly platformGames = inject(PlatformGamesService);
    private readonly host = inject(ElementRef<HTMLElement>);

    public toggleMenu(): void {
        if (!this.canSwitch()) {
            return;
        }

        this.menuOpen.update((open) => !open);
    }

    public closeMenu(): void {
        this.menuOpen.set(false);
    }

    public gameLink(game: PlatformGame): string[] {
        return game.playerPublicId ? [game.url, "players", game.playerPublicId] : [game.url];
    }

    @HostListener("document:click", ["$event"])
    protected onDocumentClick(event: MouseEvent): void {
        if (!this.host.nativeElement.contains(event.target as Node)) {
            this.closeMenu();
        }
    }

    @HostListener("document:keydown.escape")
    protected onEscape(): void {
        this.closeMenu();
    }
}
