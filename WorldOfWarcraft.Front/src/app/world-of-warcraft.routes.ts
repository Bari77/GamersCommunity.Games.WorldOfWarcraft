import { Routes } from "@angular/router";
import { ClassesService } from "@features/classes/services/classes.service";
import { ClassesStore } from "@features/classes/stores/classes.store";

export const worldOfWarcraftRoutes: Routes = [
    {
        path: "",
        providers: [ClassesService, ClassesStore],
        children: [
            {
                path: "",
                loadComponent: () =>
                    import("./pages/home-container/home-container.component").then((m) => m.HomeContainerComponent),
            },
        ],
    },
];
