import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: "",
        loadChildren: () => import("./world-of-warcraft.routes").then((m) => m.worldOfWarcraftRoutes),
    },
];
