import { LfgMessageDto, PostableGuildDto } from "@features/lfg/dto/lfg-message.dto";
import { HomeFeedDto } from "@features/home/dto/home-feed.dto";
import {
    EMBERHOLD_ID,
    GUILD_PUBLIC_ID,
    STORMWATCH_ID,
    mockGuildSummaries,
} from "./orgs";
import {
    allPlayerSheets,
    mockCharacters,
    toCharacterSummary,
    toPlayerSummary,
} from "./characters";
import { mockUuid } from "./ids";
import { mockPortraitUrl, persona } from "./personas";

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3600000).toISOString();
const tomorrow = () => new Date(Date.now() + 86400000).toISOString();

function lfg(opts: {
    publicId: string;
    nickname: string;
    body: string;
    hoursAgo: number;
    serverName: string;
    directionName: string;
}): LfgMessageDto {
    const who = persona(opts.nickname);
    return {
        publicId: opts.publicId,
        kind: "lfg",
        body: opts.body,
        senderNickname: who.nickname,
        senderDiscriminator: who.discriminator,
        creationDate: hoursAgo(opts.hoursAgo),
        expiresAt: tomorrow(),
        playerPublicId: who.playerPublicId,
        platformUserPublicId: who.platformUserPublicId,
        senderAvatarUrl: mockPortraitUrl(who.nickname),
        serverName: opts.serverName,
        directionName: opts.directionName,
    };
}

export const mockLfgMessages: LfgMessageDto[] = [
    lfg({
        publicId: mockUuid("wow:feed:11111111-1111-1111-1111-111111111111"),
        nickname: "Aelindra",
        body: "Need healer for +12 Streets tonight.",
        hoursAgo: 2,
        serverName: "hyjal",
        directionName: "heal",
    }),
    lfg({
        publicId: mockUuid("wow:feed:11111111-1111-1111-1111-111111111112"),
        nickname: "Thalorim",
        body: "Tank LF 3 for heroic raid, 20:30 ST.",
        hoursAgo: 1,
        serverName: "hyjal",
        directionName: "tank",
    }),
    lfg({
        publicId: mockUuid("wow:feed:11111111-1111-1111-1111-111111111113"),
        nickname: "Nerysse",
        body: "Disc priest LFG keys, 640 ilvl.",
        hoursAgo: 0.4,
        serverName: "hyjal",
        directionName: "heal",
    }),
    lfg({
        publicId: mockUuid("wow:feed:11111111-1111-1111-1111-111111111114"),
        nickname: "Vaelis",
        body: "BM hunter LF 2 for +8 Academy.",
        hoursAgo: 0.8,
        serverName: "elune",
        directionName: "dps",
    }),
    lfg({
        publicId: mockUuid("wow:feed:11111111-1111-1111-1111-111111111115"),
        nickname: "Maelis",
        body: "Havoc DH looking for a M+ group, I live in melee.",
        hoursAgo: 3.2,
        serverName: "hyjal",
        directionName: "dps",
    }),
    lfg({
        publicId: mockUuid("wow:feed:11111111-1111-1111-1111-111111111116"),
        nickname: "Elyndra",
        body: "Arcane mage LF keys, flexible on role swap to frost.",
        hoursAgo: 1.6,
        serverName: "dalaran",
        directionName: "dps",
    }),
    lfg({
        publicId: mockUuid("wow:feed:11111111-1111-1111-1111-111111111117"),
        nickname: "Zarokh",
        body: "Sub rogue LF mythic push duo, voice preferred.",
        hoursAgo: 0.2,
        serverName: "hyjal",
        directionName: "dps",
    }),
    lfg({
        publicId: mockUuid("wow:feed:11111111-1111-1111-1111-111111111118"),
        nickname: "Isendre",
        body: "Holy priest free for heroic farm, Stormwatch alts welcome.",
        hoursAgo: 4.5,
        serverName: "hyjal",
        directionName: "heal",
    }),
];

const blackrock = mockGuildSummaries[1];
const moonwell = mockGuildSummaries[2];
const ashen = mockGuildSummaries[3];
const stormwatch = mockGuildSummaries.find((guild) => guild.publicId === STORMWATCH_ID)!;
const emberhold = mockGuildSummaries.find((guild) => guild.publicId === EMBERHOLD_ID)!;

function recruit(opts: {
    publicId: string;
    nickname: string;
    body: string;
    hoursAgo: number;
    guild: (typeof mockGuildSummaries)[number];
    serverName: string;
    directionName: string;
}): LfgMessageDto {
    const who = persona(opts.nickname);
    return {
        publicId: opts.publicId,
        kind: "recruit",
        body: opts.body,
        senderNickname: who.nickname,
        senderDiscriminator: who.discriminator,
        creationDate: hoursAgo(opts.hoursAgo),
        expiresAt: tomorrow(),
        playerPublicId: who.playerPublicId,
        platformUserPublicId: who.platformUserPublicId,
        senderAvatarUrl: mockPortraitUrl(who.nickname),
        guildPublicId: opts.guild.publicId,
        guildName: opts.guild.entitled,
        guildDiscriminator: opts.guild.discriminator,
        guildCrest: opts.guild.crest,
        serverName: opts.serverName,
        directionName: opts.directionName,
    };
}

export const mockRecruitmentMessages: LfgMessageDto[] = [
    recruit({
        publicId: mockUuid("wow:feed:66666666-6666-6666-6666-666666666666"),
        nickname: "Aelindra",
        body: "Guardians of Azeroth is recruiting ranged DPS for heroic progress.",
        hoursAgo: 5,
        guild: mockGuildSummaries[0],
        serverName: "hyjal",
        directionName: "dps",
    }),
    recruit({
        publicId: mockUuid("wow:feed:66666666-6666-6666-6666-666666666667"),
        nickname: "Korrath",
        body: "Blackrock Vanguard — casual PvP, Horde, evenings. Tanks welcome.",
        hoursAgo: 3,
        guild: blackrock,
        serverName: "archimonde",
        directionName: "tank",
    }),
    recruit({
        publicId: mockUuid("wow:feed:66666666-6666-6666-6666-666666666668"),
        nickname: "Vaelis",
        body: "Moonwell Circle — social PvE on Elune. Tanks very welcome.",
        hoursAgo: 6.5,
        guild: moonwell,
        serverName: "elune",
        directionName: "tank",
    }),
    recruit({
        publicId: mockUuid("wow:feed:66666666-6666-6666-6666-666666666669"),
        nickname: "Orinthal",
        body: "Ashen Covenant is looking for a healer for heroic Dalaran raids.",
        hoursAgo: 8,
        guild: ashen,
        serverName: "dalaran",
        directionName: "heal",
    }),
    recruit({
        publicId: mockUuid("wow:feed:66666666-6666-6666-6666-66666666666a"),
        nickname: "Dravenor",
        body: "Stormwatch Keep — Alliance heroic + M+ on Hyjal. Healers preferred.",
        hoursAgo: 2.5,
        guild: stormwatch,
        serverName: "hyjal",
        directionName: "heal",
    }),
    recruit({
        publicId: mockUuid("wow:feed:66666666-6666-6666-6666-66666666666b"),
        nickname: "Lythara",
        body: "Emberhold Pact recruiting melee DPS for Archimonde progress.",
        hoursAgo: 4,
        guild: emberhold,
        serverName: "archimonde",
        directionName: "dps",
    }),
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
