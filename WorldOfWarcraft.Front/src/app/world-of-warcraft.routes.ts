/// <reference types="@angular/localize" />

import { Routes } from "@angular/router";
import { provideGameRemoteKernel } from "@bari77/gc-sdk";
import { WOW_GAME_ID, WOW_GAME_URL } from "@core/constants/game.constants";
import { PlatformUsersService } from "@core/services/platform-users.service";
import { PlatformAvatarStore } from "@core/stores/platform-avatar.store";
import { CharactersService } from "@features/characters/services/characters.service";
import { ClassesService } from "@features/classes/services/classes.service";
import { ClassesStore } from "@features/classes/stores/classes.store";
import { GamePostsService } from "@features/guilds/services/game-posts.service";
import { GuildApplicationsService } from "@features/guilds/services/guild-applications.service";
import { GuildLinkService } from "@features/guilds/services/guild-link.service";
import { GuildsService } from "@features/guilds/services/guilds.service";
import { HomeFeedService } from "@features/home/services/home-feed.service";
import { HomeFeedStore } from "@features/home/stores/home-feed.store";
import { LfgChatService, PostableGuildsService } from "@features/lfg/services/lfg-chat.service";
import { LfgRealtimeService } from "@features/lfg/services/lfg-realtime.service";
import { PlayerLinkService } from "@features/links/services/player-link.service";
import { PlayersService } from "@features/players/services/players.service";
import { environment } from "../environments/environment";

/**
 * Game services live on this remote injector (not providedIn: "root") so federation
 * into the Platform shell does not resolve them against the host root.
 * SDK kernel services come from provideGameRemoteKernel.
 */
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
    HomeFeedService,
    PlayersService,
    CharactersService,
    GuildsService,
    GuildLinkService,
    GamePostsService,
    GuildApplicationsService,
    LfgChatService,
    PostableGuildsService,
    LfgRealtimeService,
    PlayerLinkService,
    PlatformUsersService,
    PlatformAvatarStore,
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
