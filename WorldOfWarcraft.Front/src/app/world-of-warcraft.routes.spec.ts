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

    it("keeps the sheet, directory, and search entry points", () => {
        expect(child("sheet")?.loadComponent).toBeTruthy();
        expect(child("players/:publicId")?.loadComponent).toBeTruthy();
        expect(child("search")?.loadComponent).toBeTruthy();
        expect(child("guilds")?.loadComponent).toBeTruthy();
        expect(child("guilds/:publicId")?.loadComponent).toBeTruthy();
    });
});
