import { GuildCrest } from "./guild-crest";

describe("GuildCrest", () => {
    it("falls back to defaults when the DTO is missing", () => {
        const crest = GuildCrest.fromDto(null);
        expect(crest.emblem).toBe(0);
        expect(crest.emblemColor).toBe("#f0e6c8");
        expect(crest.faction).toBeNull();
    });

    it("round-trips through toDto/with", () => {
        const crest = GuildCrest.fromDto({
            emblem: 12,
            emblemColor: "#aabbcc",
            border: 3,
            borderColor: "#112233",
            backgroundColor: "#445566",
            faction: "horde",
        });
        expect(crest.toDto().faction).toBe("horde");
        expect(crest.with({ emblem: 20 }).emblem).toBe(20);
        expect(crest.emblem).toBe(12);
    });
});
