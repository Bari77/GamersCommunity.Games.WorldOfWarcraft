import { DatePipe } from "@angular/common";
import { Component, computed, inject, input, resource } from "@angular/core";
import { WOW_GAME_URL } from "@core/constants/game.constants";
import { PlatformGamesService } from "@core/services/platform-games.service";
import { guildOrientationLabel } from "@features/guilds/models/guild-orientation";
import { GuildSheet } from "@features/guilds/models/guild.model";
import { GuildCrestComponent } from "@shared/components/guild-crest/guild-crest.component";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";
import { firstValueFrom } from "rxjs";

/** Fixed identity band above the guild workspace, mirroring the player sheet's hero. */
@Component({
    standalone: true,
    selector: "wow-guild-hero",
    imports: [DatePipe, GameTermPipe, GuildCrestComponent],
    templateUrl: "./guild-hero.component.html",
    styleUrl: "./guild-hero.component.scss",
})
export class GuildHeroComponent {
    public readonly guild = input.required<GuildSheet>();

    protected readonly orientationLabel = computed(() => guildOrientationLabel(this.guild().orientationName));

    public readonly games = resource({
        loader: () => firstValueFrom(this.platformGames.list()).catch(() => []),
        defaultValue: [],
    });

    public readonly currentGame = computed(() => this.games.value().find((game) => game.url === WOW_GAME_URL));

    private readonly platformGames = inject(PlatformGamesService);
}
