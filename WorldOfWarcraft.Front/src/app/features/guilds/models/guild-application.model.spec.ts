import { GuildApplication } from "./guild-application.model";

describe("GuildApplication", () => {
    it("maps pending status and player-sheet presence", () => {
        const pending = GuildApplication.fromDto({
            publicId: "app-1",
            message: "hi",
            status: "pending",
            creationDate: "2026-10-12T00:00:00Z",
            reviewedAt: null,
            guildPublicId: "guild-1",
            guildName: "Storm",
            guildDiscriminator: "0001",
            characterPublicId: "char-1",
            characterPseudo: "Ada",
            characterLevel: 80,
            characterClassName: "mage",
            characterRaceName: "human",
            characterServerName: "Hyjal",
            playerPublicId: "player-1",
            platformUserPublicId: "user-1",
            nickname: "Ada",
            discriminator: "0001",
            avatarUrl: "",
        });

        expect(pending.isPending()).toBeTrue();
        expect(pending.hasPlayerSheet()).toBeTrue();
        expect(pending.guildHandleLabel()).toBe("Storm#0001");
        expect(pending.playerHandleLabel()).toBe("Ada#0001");
    });

    it("rejects empty player sheet guids", () => {
        const orphan = GuildApplication.fromDto({
            publicId: "app-2",
            message: "",
            status: "accepted",
            creationDate: "2026-10-12T00:00:00Z",
            reviewedAt: "2026-10-12T01:00:00Z",
            guildPublicId: "guild-1",
            guildName: "Storm",
            guildDiscriminator: "0001",
            characterPublicId: "char-1",
            characterPseudo: "Ada",
            characterLevel: 80,
            characterClassName: "mage",
            characterRaceName: "human",
            characterServerName: "Hyjal",
            playerPublicId: "00000000-0000-0000-0000-000000000000",
            platformUserPublicId: "user-1",
            nickname: "Ada",
            discriminator: "0001",
            avatarUrl: "",
        });

        expect(orphan.isPending()).toBeFalse();
        expect(orphan.hasPlayerSheet()).toBeFalse();
    });
});
