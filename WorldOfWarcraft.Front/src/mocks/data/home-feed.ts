import { LfgMessageDto, PostableGuildDto } from "@features/lfg/dto/lfg-message.dto";
import { HomeFeedDto } from "@features/home/dto/home-feed.dto";
import { GUILD_PUBLIC_ID, mockGuildSheet, mockGuildSummaries } from "./guilds";
import {
    PLAYER_PUBLIC_ID,
    PLATFORM_USER_PUBLIC_ID,
    allPlayerSheets,
    mockCharacters,
    toCharacterSummary,
    toPlayerSummary,
} from "./characters";
import { mockPortraitUrl } from "./portraits";

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3600000).toISOString();
const tomorrow = () => new Date(Date.now() + 86400000).toISOString();

export const mockLfgMessages: LfgMessageDto[] = [
    {
        publicId: "11111111-1111-1111-1111-111111111111",
        kind: "lfg",
        body: "Need healer for +12 Streets tonight.",
        senderNickname: "Aelindra",
        senderDiscriminator: "0042",
        creationDate: hoursAgo(2),
        expiresAt: tomorrow(),
        playerPublicId: PLAYER_PUBLIC_ID,
        platformUserPublicId: PLATFORM_USER_PUBLIC_ID,
        senderAvatarUrl: mockPortraitUrl("Aelindra"),
        serverName: "hyjal",
        directionName: "heal",
    },
    {
        publicId: "11111111-1111-1111-1111-111111111112",
        kind: "lfg",
        body: "Tank LF 3 for heroic raid, 20:30 ST.",
        senderNickname: "Thalorim",
        senderDiscriminator: "0108",
        creationDate: hoursAgo(1),
        expiresAt: tomorrow(),
        playerPublicId: "22222222-2222-2222-2222-22222222222a",
        platformUserPublicId: "33333333-3333-3333-3333-33333333333a",
        senderAvatarUrl: mockPortraitUrl("Thalorim"),
        serverName: "hyjal",
        directionName: "tank",
    },
    {
        publicId: "11111111-1111-1111-1111-111111111113",
        kind: "lfg",
        body: "Disc priest LFG keys, 640 ilvl.",
        senderNickname: "Nerysse",
        senderDiscriminator: "0731",
        creationDate: hoursAgo(0.4),
        expiresAt: tomorrow(),
        playerPublicId: "22222222-2222-2222-2222-22222222222b",
        platformUserPublicId: "33333333-3333-3333-3333-33333333333b",
        senderAvatarUrl: mockPortraitUrl("Nerysse"),
        serverName: "hyjal",
        directionName: "heal",
    },
    {
        publicId: "11111111-1111-1111-1111-111111111114",
        kind: "lfg",
        body: "BM hunter LF 2 for +8 Academy.",
        senderNickname: "Vaelis",
        senderDiscriminator: "0904",
        creationDate: hoursAgo(0.8),
        expiresAt: tomorrow(),
        playerPublicId: "22222222-2222-2222-2222-22222222222d",
        platformUserPublicId: "33333333-3333-3333-3333-33333333333d",
        senderAvatarUrl: mockPortraitUrl("Vaelis"),
        serverName: "elune",
        directionName: "dps",
    },
    {
        publicId: "11111111-1111-1111-1111-111111111115",
        kind: "lfg",
        body: "Havoc DH looking for a M+ group, I live in melee.",
        senderNickname: "Maelis",
        senderDiscriminator: "0622",
        creationDate: hoursAgo(3.2),
        expiresAt: tomorrow(),
        playerPublicId: "22222222-2222-2222-2222-22222222222f",
        platformUserPublicId: "33333333-3333-3333-3333-33333333333f",
        senderAvatarUrl: mockPortraitUrl("Maelis"),
        serverName: "hyjal",
        directionName: "dps",
    },
];

const blackrock = mockGuildSummaries[1];
const moonwell = mockGuildSummaries[2];
const ashen = mockGuildSummaries[3];

export const mockRecruitmentMessages: LfgMessageDto[] = [
    {
        publicId: "66666666-6666-6666-6666-666666666666",
        kind: "recruit",
        body: "Guardians of Azeroth is recruiting ranged DPS for heroic progress.",
        senderNickname: "Aelindra",
        senderDiscriminator: "0042",
        creationDate: hoursAgo(5),
        expiresAt: tomorrow(),
        playerPublicId: PLAYER_PUBLIC_ID,
        platformUserPublicId: PLATFORM_USER_PUBLIC_ID,
        senderAvatarUrl: mockPortraitUrl("Aelindra"),
        guildPublicId: GUILD_PUBLIC_ID,
        guildName: "Guardians of Azeroth",
        guildDiscriminator: "0001",
        guildCrest: mockGuildSheet.crest,
        serverName: "hyjal",
        directionName: "dps",
    },
    {
        publicId: "66666666-6666-6666-6666-666666666667",
        kind: "recruit",
        body: "Blackrock Vanguard — casual PvP, Horde, evenings. Tanks welcome.",
        senderNickname: "Korrath",
        senderDiscriminator: "2214",
        creationDate: hoursAgo(3),
        expiresAt: tomorrow(),
        playerPublicId: "22222222-2222-2222-2222-22222222222c",
        platformUserPublicId: "33333333-3333-3333-3333-33333333333c",
        senderAvatarUrl: mockPortraitUrl("Korrath"),
        guildPublicId: blackrock.publicId,
        guildName: blackrock.entitled,
        guildDiscriminator: blackrock.discriminator,
        guildCrest: blackrock.crest,
        serverName: "archimonde",
        directionName: "tank",
    },
    {
        publicId: "66666666-6666-6666-6666-666666666668",
        kind: "recruit",
        body: "Moonwell Circle — social PvE on Elune. Tanks very welcome.",
        senderNickname: "Vaelis",
        senderDiscriminator: "0904",
        creationDate: hoursAgo(6.5),
        expiresAt: tomorrow(),
        playerPublicId: "22222222-2222-2222-2222-22222222222d",
        platformUserPublicId: "33333333-3333-3333-3333-33333333333d",
        senderAvatarUrl: mockPortraitUrl("Vaelis"),
        guildPublicId: moonwell.publicId,
        guildName: moonwell.entitled,
        guildDiscriminator: moonwell.discriminator,
        guildCrest: moonwell.crest,
        serverName: "elune",
        directionName: "tank",
    },
    {
        publicId: "66666666-6666-6666-6666-666666666669",
        kind: "recruit",
        body: "Ashen Covenant is looking for a healer for heroic Dalaran raids.",
        senderNickname: "Orinthal",
        senderDiscriminator: "1180",
        creationDate: hoursAgo(8),
        expiresAt: tomorrow(),
        playerPublicId: "22222222-2222-2222-2222-22222222222e",
        platformUserPublicId: "33333333-3333-3333-3333-33333333333e",
        senderAvatarUrl: mockPortraitUrl("Orinthal"),
        guildPublicId: ashen.publicId,
        guildName: ashen.entitled,
        guildDiscriminator: ashen.discriminator,
        guildCrest: ashen.crest,
        serverName: "dalaran",
        directionName: "heal",
    },
];

export const mockPostableGuilds: PostableGuildDto[] = [
    {
        publicId: GUILD_PUBLIC_ID,
        entitled: "Guardians of Azeroth",
        discriminator: "0001",
        rank: "leader",
    },
];

const FEED_TAKE = 5;

const latestCharacters = [...mockCharacters]
    .sort((left, right) => right.creationDate.localeCompare(left.creationDate))
    .slice(0, FEED_TAKE)
    .map(toCharacterSummary);

const latestPlayers = [...allPlayerSheets()]
    .sort((left, right) => right.creationDate.localeCompare(left.creationDate))
    .slice(0, FEED_TAKE)
    .map(toPlayerSummary);

const latestGuilds = [...mockGuildSummaries]
    .sort((left, right) => right.creationDate.localeCompare(left.creationDate))
    .slice(0, FEED_TAKE);

export const mockHomeFeed: HomeFeedDto = {
    latestLfg: mockLfgMessages,
    latestCharacters,
    latestPlayers,
    latestGuilds,
};
