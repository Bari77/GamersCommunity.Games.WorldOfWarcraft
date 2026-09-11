import { GamePostDto } from "@features/guilds/dto/game-post.dto";
import { GuildApplicationDto } from "@features/guilds/dto/guild-application.dto";
import { GuildSheetDto, GuildSummaryDto } from "@features/guilds/dto/guild.dto";

const GUILD_PUBLIC_ID = "55555555-5555-5555-5555-555555555555";

const PLAYER_PUBLIC_ID = "22222222-2222-2222-2222-222222222222";
const PLATFORM_USER_PUBLIC_ID = "33333333-3333-3333-3333-333333333333";

/** The mocked visitor is an officer, so the moderation surfaces are reachable offline. */
export const mockGuildSheet: GuildSheetDto = {
    publicId: GUILD_PUBLIC_ID,
    entitled: "Guardians of Azeroth",
    discriminator: "0001",
    level: 25,
    sentence: "Heroic progress guild, EU evenings.",
    linkDiscord: "https://discord.gg/example",
    linkForum: null,
    serverName: "hyjal",
    directionName: "heal",
    creationDate: new Date("2024-11-02T18:00:00Z").toISOString(),
    memberCount: 2,
    viewerRank: "officer",
    viewerApplicationStatus: null,
    viewerApplicationPublicId: null,
    pendingApplicationCount: 1,
    pendingPostCount: 1,
    members: [
        {
            characterPublicId: "44444444-4444-4444-4444-444444444444",
            pseudo: "Aelindra",
            level: 80,
            className: "druid",
            raceName: "night_elf",
            rank: "officer",
            playerPublicId: PLAYER_PUBLIC_ID,
            platformUserPublicId: PLATFORM_USER_PUBLIC_ID,
            nickname: "Aelindra",
            discriminator: "0042",
            avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Aelindra",
            joinedAt: new Date("2024-11-02T18:05:00Z").toISOString(),
        },
        {
            characterPublicId: "44444444-4444-4444-4444-44444444444a",
            pseudo: "Thalorim",
            level: 80,
            className: "paladin",
            raceName: "human",
            rank: "leader",
            playerPublicId: "22222222-2222-2222-2222-22222222222a",
            platformUserPublicId: "33333333-3333-3333-3333-33333333333a",
            nickname: "Thalorim",
            discriminator: "0108",
            avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Thalorim",
            joinedAt: new Date("2024-11-02T18:00:00Z").toISOString(),
        },
    ],
};

export const mockGuildSummaries: GuildSummaryDto[] = [
    {
        publicId: GUILD_PUBLIC_ID,
        entitled: "Guardians of Azeroth",
        discriminator: "0001",
        level: 25,
        creationDate: mockGuildSheet.creationDate,
        serverName: "hyjal",
        memberCount: 2,
        sentence: "Heroic progress guild, EU evenings.",
        alignmentName: "alliance",
    },
    {
        publicId: "55555555-5555-5555-5555-55555555555a",
        entitled: "Blackrock Vanguard",
        discriminator: "0417",
        level: 18,
        creationDate: new Date("2025-02-14T20:30:00Z").toISOString(),
        serverName: "archimonde",
        memberCount: 34,
        sentence: "Casual PvP, Horde side.",
        alignmentName: "horde",
    },
];

export const mockGuildApplications: GuildApplicationDto[] = [
    {
        publicId: "88888888-8888-8888-8888-888888888888",
        message: "Resto druid, 8/8 heroic cleared, looking for a mythic roster.",
        status: "pending",
        creationDate: new Date("2026-09-08T19:12:00Z").toISOString(),
        reviewedAt: null,
        guildPublicId: GUILD_PUBLIC_ID,
        guildName: "Guardians of Azeroth",
        guildDiscriminator: "0001",
        characterPublicId: "44444444-4444-4444-4444-44444444444b",
        characterPseudo: "Nerysse",
        characterLevel: 80,
        characterClassName: "priest",
        characterRaceName: "void_elf",
        characterServerName: "hyjal",
        playerPublicId: "22222222-2222-2222-2222-22222222222b",
        platformUserPublicId: "33333333-3333-3333-3333-33333333333b",
        nickname: "Nerysse",
        discriminator: "0731",
        avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Nerysse",
    },
];

export const mockGuildWallPosts: GamePostDto[] = [
    {
        publicId: "99999999-9999-9999-9999-999999999999",
        guildPublicId: GUILD_PUBLIC_ID,
        guildName: "Guardians of Azeroth",
        guildDiscriminator: "0001",
        body: "Mythic raid night moved to Thursday. Sign up on Discord.",
        mediaUrl: null,
        mediaKind: null,
        status: "approved",
        creationDate: new Date("2026-09-10T20:00:00Z").toISOString(),
        authorPlayerPublicId: "22222222-2222-2222-2222-22222222222a",
        authorPlatformUserPublicId: "33333333-3333-3333-3333-33333333333a",
        authorNickname: "Thalorim",
        authorDiscriminator: "0108",
        authorAvatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Thalorim",
        moderationReason: null,
        moderatedAt: new Date("2026-09-10T20:00:00Z").toISOString(),
    },
];

export const mockPendingPosts: GamePostDto[] = [
    {
        publicId: "99999999-9999-9999-9999-99999999999a",
        guildPublicId: GUILD_PUBLIC_ID,
        guildName: "Guardians of Azeroth",
        guildDiscriminator: "0001",
        body: "Selling my mount collection, DM me.",
        mediaUrl: null,
        mediaKind: null,
        status: "pending",
        creationDate: new Date("2026-09-11T08:30:00Z").toISOString(),
        authorPlayerPublicId: "22222222-2222-2222-2222-22222222222b",
        authorPlatformUserPublicId: "33333333-3333-3333-3333-33333333333b",
        authorNickname: "Nerysse",
        authorDiscriminator: "0731",
        authorAvatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Nerysse",
        moderationReason: null,
        moderatedAt: null,
    },
];
