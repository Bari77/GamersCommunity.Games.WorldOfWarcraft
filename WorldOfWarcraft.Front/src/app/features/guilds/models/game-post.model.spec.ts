import { GUILD_RANK_MEMBER } from "./guild.model";
import { GamePost } from "./game-post.model";

describe("GamePost", () => {
    it("defaults missing visibility to member rather than public", () => {
        const post = GamePost.fromDto({
            publicId: "post-1",
            guildPublicId: "guild-1",
            guildName: "Storm",
            guildDiscriminator: "0001",
            body: "raid tonight",
            mediaUrl: null,
            mediaKind: null,
            status: "pending",
            creationDate: "2026-10-12T00:00:00Z",
            authorPlayerPublicId: "player-1",
            authorPlatformUserPublicId: "user-1",
            authorNickname: "Ada",
            authorDiscriminator: "0001",
            authorAvatarUrl: "",
            moderationReason: null,
            moderatedAt: null,
        });

        expect(post.visibility).toBe(GUILD_RANK_MEMBER);
        expect(post.isPublic()).toBeFalse();
        expect(post.isPending()).toBeTrue();
        expect(post.isMine("player-1")).toBeTrue();
    });
});
