/// <reference types="@angular/localize" />

import { Routes } from "@angular/router";
import { ClassesService } from "@features/classes/services/classes.service";
import { ClassesStore } from "@features/classes/stores/classes.store";
import { HomeFeedStore } from "@features/home/stores/home-feed.store";

export const worldOfWarcraftRoutes: Routes = [
    {
        path: "",
        providers: [ClassesService, ClassesStore, HomeFeedStore],
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
            import("@features/players/pages/player-sheet/player-sheet.component").then((m) => m.PlayerSheetComponent),
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
            import("@features/guilds/pages/guild-sheet/guild-sheet.component").then((m) => m.GuildSheetComponent),
    },
    {
        path: "lfg",
        data: { breadcrumb: $localize`:@@wow.breadcrumb.lfg:Looking for group` },
        loadComponent: () =>
            import("@features/lfg/pages/lfg-board/lfg-board.component").then((m) => m.LfgBoardComponent),
    },
];
