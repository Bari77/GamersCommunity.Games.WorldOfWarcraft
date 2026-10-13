import { Route } from "@angular/router";
import { worldOfWarcraftRoutes } from "./world-of-warcraft.routes";

describe("worldOfWarcraftRoutes", () => {
    const children = worldOfWarcraftRoutes[0]?.children ?? [];

    function child(path: string): Route | undefined {
        return children.find((entry) => entry.path === path);
    }

    it("mounts the remote kernel on the game root", () => {
        expect(worldOfWarcraftRoutes[0]?.providers?.length).toBeGreaterThan(0);
        expect(child("")?.loadComponent).toBeTruthy();
    });

    it("keeps the sheet and search entry points, and folds the guild directory into search", () => {
        expect(child("sheet")?.loadComponent).toBeTruthy();
        expect(child("players/:publicId")?.loadComponent).toBeTruthy();
        expect(child("search")?.loadComponent).toBeTruthy();
        expect(child("guilds")?.redirectTo).toBeTruthy();
        expect(child("guilds")?.pathMatch).toBe("full");
        expect(child("guilds/:publicId")?.loadComponent).toBeTruthy();
    });
});
