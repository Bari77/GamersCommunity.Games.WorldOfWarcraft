/// <reference types="@angular/localize" />

import { Routes } from "@angular/router";
import { provideGameRemoteKernel } from "@bari77/gc-sdk";
import { WOW_GAME_ID, WOW_GAME_URL } from "@core/constants/game.constants";
import { ClassesService } from "@features/classes/services/classes.service";
import { ClassesStore } from "@features/classes/stores/classes.store";
import { HomeFeedStore } from "@features/home/stores/home-feed.store";
import { PlayersService } from "@features/players/services/players.service";
import { environment } from "../environments/environment";

/** Kernel + catalog providers for the whole remote tree (standalone and Platform federation). */
const wowRemoteProviders = [
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
    ClassesService,
    ClassesStore,
];

export const worldOfWarcraftRoutes: Routes = [
    {
        path: "",
        providers: wowRemoteProviders,
        children: [
            {
                path: "",
                providers: [HomeFeedStore],
                loadComponent: () =>
                    import("./pages/home-container/home-container.component").then((m) => m.HomeContainerComponent),
            },
            {
                path: "sheet",
                loadComponent: () =>
                    import("@features/players/pages/my-sheet/my-sheet.component").then((m) => m.MySheetComponent),
            },
            {
                path: "players/:publicId",
                data: { breadcrumb: $localize`:@@wow.breadcrumb.player:Player` },
                loadComponent: () =>
                    import("@features/players/pages/player-sheet/player-sheet.component").then(
                        (m) => m.PlayerSheetComponent,
                    ),
            },
            {
                path: "search",
                data: { breadcrumb: $localize`:@@wow.breadcrumb.search:Search` },
                loadComponent: () =>
                    import("@features/search/pages/global-search/global-search.component").then(
                        (m) => m.GlobalSearchComponent,
                    ),
            },
            {
                path: "guilds",
                data: { breadcrumb: $localize`:@@wow.breadcrumb.guilds:Guilds` },
                loadComponent: () =>
                    import("@features/guilds/pages/guild-directory/guild-directory.component").then(
                        (m) => m.GuildDirectoryComponent,
                    ),
            },
            {
                path: "guilds/:publicId",
                data: { breadcrumb: $localize`:@@wow.breadcrumb.guild:Guild` },
                loadComponent: () =>
                    import("@features/guilds/pages/guild-sheet/guild-sheet.component").then(
                        (m) => m.GuildSheetComponent,
                    ),
            },
        ],
    },
];
