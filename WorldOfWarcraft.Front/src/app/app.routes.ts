/// <reference types="@angular/localize" />

import { Routes } from "@angular/router";
import { WOW_GAME_URL } from "./core/constants/game.constants";

export const routes: Routes = [
    { path: "", pathMatch: "full", redirectTo: "world-of-warcraft" },
    {
        path: "world-of-warcraft",
        data: {
            breadcrumb: $localize`:@@wow.playground.breadcrumb.game:World of Warcraft`,
            gameNav: [
                {
                    path: `${WOW_GAME_URL}/sheet`,
                    label: $localize`:@@wow.playground.nav.sheet:My profile`,
                },
                {
                    path: `${WOW_GAME_URL}/guilds`,
                    label: $localize`:@@wow.playground.nav.guilds:Guilds`,
                },
            ],
            gameSearch: {
                path: `${WOW_GAME_URL}/search`,
                label: $localize`:@@wow.playground.search:Search a character, a player or a guild`,
            },
        },
        loadChildren: () => import("./world-of-warcraft.routes").then((m) => m.worldOfWarcraftRoutes),
    },
    {
        path: "users/login",
        loadComponent: () =>
            import("./playground/playground-session.component").then((m) => m.PlaygroundSessionComponent),
    },
    {
        path: "users/:publicId",
        loadComponent: () =>
            import("./playground/playground-user-profile.component").then((m) => m.PlaygroundUserProfileComponent),
    },
];
