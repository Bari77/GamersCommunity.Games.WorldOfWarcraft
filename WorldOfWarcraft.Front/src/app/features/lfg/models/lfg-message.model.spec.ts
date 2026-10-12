import { LfgMessage } from "./lfg-message.model";

describe("LfgMessage", () => {
    it("labels guild recruitment under the guild handle", () => {
        const ad = LfgMessage.fromDto({
            publicId: "lfg-1",
            kind: "recruit",
            body: "recruiting healers",
            senderNickname: "Ada",
            senderDiscriminator: "0001",
            creationDate: "2026-10-12T00:00:00Z",
            expiresAt: "2026-10-13T00:00:00Z",
            playerPublicId: "player-1",
            platformUserPublicId: "user-1",
            senderAvatarUrl: "",
            guildPublicId: "guild-1",
            guildName: "Storm",
            guildDiscriminator: "0001",
            guildCrest: null,
            serverName: "Hyjal",
            directionName: "Alliance",
        });

        expect(ad.isGuildAd()).toBeTrue();
        expect(ad.handleLabel()).toBe("Storm#0001");
        expect(ad.isMine("user-1")).toBeTrue();
        expect(ad.isMine("other")).toBeFalse();
        expect(ad.isMine(null, "player-1")).toBeTrue();
    });

    it("labels player LFG under the sender handle", () => {
        const ad = LfgMessage.fromDto({
            publicId: "lfg-2",
            kind: "lfg",
            body: "lf guild",
            senderNickname: "Ada",
            senderDiscriminator: "0001",
            creationDate: "2026-10-12T00:00:00Z",
            expiresAt: "2026-10-13T00:00:00Z",
            playerPublicId: "player-1",
            platformUserPublicId: "00000000-0000-0000-0000-000000000000",
            senderAvatarUrl: "",
        });

        expect(ad.isGuildAd()).toBeFalse();
        expect(ad.handleLabel()).toBe("Ada#0001");
        expect(ad.hasPlatformProfile()).toBeFalse();
    });
});
