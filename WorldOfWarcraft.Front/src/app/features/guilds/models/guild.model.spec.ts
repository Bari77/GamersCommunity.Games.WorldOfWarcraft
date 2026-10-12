import {
    GUILD_RANK_LEADER,
    GUILD_RANK_MEMBER,
    GUILD_RANK_OFFICER,
    GuildSheet,
    guildRankWeight,
} from "./guild.model";

describe("guild ranks", () => {
    it("orders leader > officer > member", () => {
        expect(guildRankWeight(GUILD_RANK_LEADER)).toBeGreaterThan(guildRankWeight(GUILD_RANK_OFFICER));
        expect(guildRankWeight(GUILD_RANK_OFFICER)).toBeGreaterThan(guildRankWeight(GUILD_RANK_MEMBER));
        expect(guildRankWeight(null)).toBe(0);
    });
});

describe("GuildSheet permissions", () => {
    function sheet(viewerRank: string | null): GuildSheet {
        return GuildSheet.fromDto({
            publicId: "guild-1",
            entitled: "Storm",
            discriminator: "0001",
            level: 10,
            idServer: 1,
            serverName: "Hyjal",
            orientationName: "PvE",
            crest: {
                emblem: 1,
                emblemColor: "#ffffff",
                border: 0,
                borderColor: "#000000",
                backgroundColor: "#112233",
                faction: "alliance",
            },
            creationDate: "2026-10-12T00:00:00Z",
            memberCount: 0,
            members: [],
            viewerRank,
        });
    }

    it("derives membership and moderation from viewer rank", () => {
        expect(sheet(null).isMember()).toBeFalse();
        expect(sheet(GUILD_RANK_MEMBER).isMember()).toBeTrue();
        expect(sheet(GUILD_RANK_MEMBER).canModerate()).toBeFalse();
        expect(sheet(GUILD_RANK_OFFICER).canModerate()).toBeTrue();
        expect(sheet(GUILD_RANK_LEADER).isLeader()).toBeTrue();
    });
});
