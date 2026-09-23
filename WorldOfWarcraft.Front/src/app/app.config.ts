import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from "@angular/core";
import { provideHttpClient } from "@angular/common/http";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { provideGameRemoteKernel } from "@bari77/gc-sdk";
import { WOW_GAME_ID, WOW_GAME_URL } from "@core/constants/game.constants";
import { PlayersService } from "@features/players/services/players.service";
import { environment } from "../environments/environment";
import { providePlaygroundUi } from "./playground/provide-playground-ui";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(),
        provideGameRemoteKernel({
            environment: {
                apiUrl: environment.apiUrl,
                assetsBaseUrl: environment.assetsBaseUrl,
            },
            membership: {
                gameId: WOW_GAME_ID,
                gameUrl: WOW_GAME_URL,
                apiSegment: "worldofwarcraft",
            },
            playerSheetApi: PlayersService,
        }),
        // Required next to the kernel: GAME_PLAYER_SHEET_API is useExisting → PlayersService.
        // App injects GameMembershipStore at root (session chip in the playground header).
        PlayersService,
        providePlaygroundUi("cosmic"),
    ],
};
