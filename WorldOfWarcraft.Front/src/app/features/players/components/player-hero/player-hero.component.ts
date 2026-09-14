import { DatePipe } from "@angular/common";
import { Component, computed, inject, input, resource } from "@angular/core";
import { RouterLink } from "@angular/router";
import { WOW_GAME_URL } from "@core/constants/game.constants";
import { PlatformGamesService } from "@core/services/platform-games.service";
import { PlayerSheet } from "@features/players/models/player.model";
import { GuildCrestComponent } from "@shared/components/guild-crest/guild-crest.component";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";
import { firstValueFrom } from "rxjs";

@Component({
    standalone: true,
    selector: "wow-player-hero",
    imports: [DatePipe, GameTermPipe, GuildCrestComponent, RouterLink],
    templateUrl: "./player-hero.component.html",
    styleUrl: "./player-hero.component.scss",
})
export class PlayerHeroComponent {
    public readonly player = input.required<PlayerSheet>();

    protected readonly switchLabel = $localize`:@@wow.player.hero.switch:Switch to another game`;

    /** The identity snapshot arrives through a Platform event, which may lag a fresh sheet. */
    public readonly handle = computed(
        () => this.player().handle || $localize`:@@wow.player.hero.unknown:Unknown player`,
    );

    public readonly games = resource({
        loader: () => firstValueFrom(this.platformGames.list()).catch(() => []),
        defaultValue: [],
    });

    public readonly currentGame = computed(() => this.games.value().find((game) => game.url === WOW_GAME_URL));
    public readonly otherGames = computed(() => this.games.value().filter((game) => game.url !== WOW_GAME_URL));

    private readonly platformGames = inject(PlatformGamesService);
}
