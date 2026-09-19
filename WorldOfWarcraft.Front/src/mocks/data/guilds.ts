import { GamePostDto } from "@features/guilds/dto/game-post.dto";
import { GuildApplicationDto } from "@features/guilds/dto/guild-application.dto";
import { GuildMemberDto, GuildSheetDto, GuildSummaryDto } from "@features/guilds/dto/guild.dto";
import { mockCharacters } from "./characters";
import { MOCK_PERSONAS, mockPortraitUrl } from "./portraits";

export const GUILD_PUBLIC_ID = "55555555-5555-5555-5555-555555555555";
export const BLACKROCK_ID = "55555555-5555-5555-5555-55555555555a";
export const MOONWELL_ID = "55555555-5555-5555-5555-55555555555b";
export const ASHEN_ID = "55555555-5555-5555-5555-55555555555c";

function member(characterPublicId: string, rank: string, joinedAt: string): GuildMemberDto {
    const character = mockCharacters.find((item) => item.publicId === characterPublicId);
    if (!character) {
        throw new Error(`Unknown mock character ${characterPublicId}`);
    }
    const who = MOCK_PERSONAS.find((persona) => persona.playerPublicId === character.playerPublicId);
    if (!who) {
        throw new Error(`Unknown mock persona for character ${characterPublicId}`);
    }

    return {
        characterPublicId,
        pseudo: character.pseudo,
        level: character.level,
        ilvl: character.ilvl,
        className: character.className ?? "unknown",
        raceName: character.raceName,
        mainSpecializationName: character.mainSpecializationName,
        directionName: character.directionName,
        rank,
        playerPublicId: character.playerPublicId,
        platformUserPublicId: who.platformUserPublicId,
        nickname: who.nickname,
        discriminator: who.discriminator,
        avatarUrl: mockPortraitUrl(who.nickname),
        joinedAt,
    };
}

/** The mocked visitor leads the guild, so both the moderation and the layout editor are reachable. */
export const mockGuildSheet: GuildSheetDto = {
    publicId: GUILD_PUBLIC_ID,
    entitled: "Guardians of Azeroth",
    discriminator: "0001",
    level: 25,
    sentence: "Heroic progress guild, EU evenings.",
    layoutJson: null,
    idServer: 1,
    serverName: "hyjal",
    orientationName: "pvpe",
    crest: {
        emblem: 42,
        emblemColor: "#f0e6c8",
        border: 3,
        borderColor: "#c8a95a",
        backgroundColor: "#1e2a4a",
        faction: "alliance",
    },
    creationDate: new Date("2024-11-02T18:00:00Z").toISOString(),
    memberCount: 3,
    viewerRank: "leader",
    viewerApplicationStatus: null,
    viewerApplicationPublicId: null,
    pendingApplicationCount: 1,
    pendingPostCount: 1,
    members: [
        member("44444444-4444-4444-4444-444444444444", "leader", "2024-11-02T18:05:00Z"),
        member("44444444-4444-4444-4444-44444444444a", "officer", "2024-11-02T18:00:00Z"),
        member("44444444-4444-4444-4444-44444444444e", "member", "2024-12-10T19:00:00Z"),
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
        memberCount: mockGuildSheet.memberCount,
        sentence: "Heroic progress guild, EU evenings.",
        alignmentName: "alliance",
        orientationName: "pvpe",
        crest: mockGuildSheet.crest,
    },
    {
        publicId: BLACKROCK_ID,
        entitled: "Blackrock Vanguard",
        discriminator: "0417",
        level: 18,
        creationDate: new Date("2025-02-14T20:30:00Z").toISOString(),
        serverName: "archimonde",
        memberCount: 3,
        sentence: "Casual PvP, Horde side.",
        alignmentName: "horde",
        orientationName: "pvp",
        crest: {
            emblem: 7,
            emblemColor: "#e8c23a",
            border: 1,
            borderColor: "#7a1414",
            backgroundColor: "#3c0d0d",
            faction: "horde",
        },
    },
    {
        publicId: MOONWELL_ID,
        entitled: "Moonwell Circle",
        discriminator: "0088",
        level: 12,
        creationDate: new Date("2025-06-04T12:00:00Z").toISOString(),
        serverName: "elune",
        memberCount: 2,
        sentence: "Social PvE, Alliance, Elune.",
        alignmentName: "alliance",
        orientationName: "pve",
        crest: {
            emblem: 19,
            emblemColor: "#b8e0ff",
            border: 2,
            borderColor: "#6ec8ff",
            backgroundColor: "#123348",
            faction: "alliance",
        },
    },
    {
        publicId: ASHEN_ID,
        entitled: "Ashen Covenant",
        discriminator: "0204",
        level: 16,
        creationDate: new Date("2025-04-21T19:00:00Z").toISOString(),
        serverName: "dalaran",
        memberCount: 2,
        sentence: "Heroic raids, Horde, Dalaran.",
        alignmentName: "horde",
        orientationName: "pvpe",
        crest: {
            emblem: 11,
            emblemColor: "#d9b38c",
            border: 4,
            borderColor: "#5c4030",
            backgroundColor: "#2a1c14",
            faction: "horde",
        },
    },
];

const BLACKROCK = mockGuildSummaries[1];
const MOONWELL = mockGuildSummaries[2];
const ASHEN = mockGuildSummaries[3];

function extraSheet(
    summary: GuildSummaryDto,
    members: GuildMemberDto[],
): GuildSheetDto {
    return {
        publicId: summary.publicId,
        entitled: summary.entitled,
        discriminator: summary.discriminator,
        level: summary.level,
        sentence: summary.sentence,
        layoutJson: null,
        idServer: summary.serverName === "archimonde" ? 4 : summary.serverName === "elune" ? 3 : summary.serverName === "dalaran" ? 2 : 1,
        serverName: summary.serverName,
        orientationName: summary.orientationName ?? "pve",
        crest: summary.crest!,
        creationDate: summary.creationDate,
        memberCount: members.length,
        members,
        viewerRank: null,
        viewerApplicationStatus: null,
        viewerApplicationPublicId: null,
        pendingApplicationCount: 0,
        pendingPostCount: 0,
    };
}

export const extraGuildSheets: Record<string, GuildSheetDto> = {
    [BLACKROCK.publicId]: extraSheet(BLACKROCK, [
        member("44444444-4444-4444-4444-444444444445", "leader", "2025-02-14T20:35:00Z"),
        member("44444444-4444-4444-4444-44444444444f", "officer", "2025-03-02T18:00:00Z"),
        member("44444444-4444-4444-4444-444444444453", "member", "2025-08-19T21:10:00Z"),
    ]),
    [MOONWELL.publicId]: extraSheet(MOONWELL, [
        member("44444444-4444-4444-4444-44444444444c", "leader", "2025-06-04T12:05:00Z"),
        member("44444444-4444-4444-4444-444444444450", "member", "2026-01-13T10:00:00Z"),
    ]),
    [ASHEN.publicId]: extraSheet(ASHEN, [
        member("44444444-4444-4444-4444-44444444444d", "leader", "2025-04-21T19:10:00Z"),
        member("44444444-4444-4444-4444-444444444457", "member", "2025-09-03T18:40:00Z"),
    ]),
};

export function guildSheetByPublicId(publicId: string, current: GuildSheetDto): GuildSheetDto | null {
    if (publicId === current.publicId) {
        return current;
    }
    return extraGuildSheets[publicId] ?? null;
}

export const mockGuildApplications: GuildApplicationDto[] = [
    {
        publicId: "88888888-8888-8888-8888-888888888888",
        message: "Disc priest, 8/8 heroic cleared, looking for a mythic roster.",
        status: "pending",
        creationDate: new Date("2026-09-08T19:12:00Z").toISOString(),
        reviewedAt: null,
        guildPublicId: GUILD_PUBLIC_ID,
        guildName: "Guardians of Azeroth",
        guildDiscriminator: "0001",
        characterPublicId: "44444444-4444-4444-4444-44444444444b",
        characterPseudo: "Nyxara",
        characterLevel: 80,
        characterClassName: "priest",
        characterRaceName: "void_elf",
        characterServerName: "hyjal",
        playerPublicId: "22222222-2222-2222-2222-22222222222b",
        platformUserPublicId: "33333333-3333-3333-3333-33333333333b",
        nickname: "Nerysse",
        discriminator: "0731",
        avatarUrl: mockPortraitUrl("Nerysse"),
    },
];

function wallPost(opts: {
    publicId: string;
    guildPublicId: string;
    guildName: string;
    guildDiscriminator: string;
    body: string;
    visibility: string;
    status: "approved" | "pending";
    creationDate: string;
    authorNickname: string;
    moderatedAt?: string | null;
}): GamePostDto {
    const who = MOCK_PERSONAS.find((persona) => persona.nickname === opts.authorNickname);
    if (!who) {
        throw new Error(`Unknown mock persona ${opts.authorNickname}`);
    }

    return {
        publicId: opts.publicId,
        guildPublicId: opts.guildPublicId,
        guildName: opts.guildName,
        guildDiscriminator: opts.guildDiscriminator,
        body: opts.body,
        mediaUrl: null,
        mediaKind: null,
        status: opts.status,
        visibility: opts.visibility,
        creationDate: opts.creationDate,
        authorPlayerPublicId: who.playerPublicId!,
        authorPlatformUserPublicId: who.platformUserPublicId,
        authorNickname: who.nickname,
        authorDiscriminator: who.discriminator,
        authorAvatarUrl: mockPortraitUrl(who.nickname),
        moderationReason: null,
        moderatedAt: opts.moderatedAt ?? null,
    };
}

export const mockGuildWallPosts: GamePostDto[] = [
    wallPost({
        publicId: "99999999-9999-9999-9999-999999999999",
        guildPublicId: GUILD_PUBLIC_ID,
        guildName: "Guardians of Azeroth",
        guildDiscriminator: "0001",
        body: "Mythic raid night moved to Thursday. Sign up on Discord.",
        visibility: "member",
        status: "approved",
        creationDate: "2026-09-10T20:00:00Z",
        authorNickname: "Aelindra",
        moderatedAt: "2026-09-10T20:00:00Z",
    }),
    wallPost({
        publicId: "99999999-9999-9999-9999-99999999999b",
        guildPublicId: GUILD_PUBLIC_ID,
        guildName: "Guardians of Azeroth",
        guildDiscriminator: "0001",
        body: "We are recruiting a healer for the mythic roster.",
        visibility: "public",
        status: "approved",
        creationDate: "2026-09-09T17:30:00Z",
        authorNickname: "Thalorim",
        moderatedAt: "2026-09-09T17:30:00Z",
    }),
    wallPost({
        publicId: "99999999-9999-9999-9999-99999999999c",
        guildPublicId: MOONWELL_ID,
        guildName: "Moonwell Circle",
        guildDiscriminator: "0088",
        body: "Friday social night on Elune. Bring alts, leave the parses at home.",
        visibility: "public",
        status: "approved",
        creationDate: "2026-09-12T18:00:00Z",
        authorNickname: "Vaelis",
        moderatedAt: "2026-09-12T18:00:00Z",
    }),
    wallPost({
        publicId: "99999999-9999-9999-9999-99999999999d",
        guildPublicId: MOONWELL_ID,
        guildName: "Moonwell Circle",
        guildDiscriminator: "0088",
        body: "Anyone for a chill +2 this weekend? I have the keys.",
        visibility: "member",
        status: "approved",
        creationDate: "2026-09-11T16:20:00Z",
        authorNickname: "Calyra",
        moderatedAt: "2026-09-11T16:40:00Z",
    }),
    wallPost({
        publicId: "99999999-9999-9999-9999-99999999999e",
        guildPublicId: BLACKROCK_ID,
        guildName: "Blackrock Vanguard",
        guildDiscriminator: "0417",
        body: "Rated battleground tonight, 21:00 ST. Fury is stacking.",
        visibility: "member",
        status: "approved",
        creationDate: "2026-09-13T12:00:00Z",
        authorNickname: "Korrath",
        moderatedAt: "2026-09-13T12:00:00Z",
    }),
    wallPost({
        publicId: "99999999-9999-9999-9999-99999999999f",
        guildPublicId: ASHEN_ID,
        guildName: "Ashen Covenant",
        guildDiscriminator: "0204",
        body: "Need a healer for Wednesday heroic. Ping me on Discord.",
        visibility: "public",
        status: "approved",
        creationDate: "2026-09-08T19:45:00Z",
        authorNickname: "Orinthal",
        moderatedAt: "2026-09-08T19:45:00Z",
    }),
];

export const mockPendingPosts: GamePostDto[] = [
    wallPost({
        publicId: "99999999-9999-9999-9999-99999999999a",
        guildPublicId: GUILD_PUBLIC_ID,
        guildName: "Guardians of Azeroth",
        guildDiscriminator: "0001",
        body: "Can we move the Tuesday key to 21:30? Raid logging ran long.",
        visibility: "member",
        status: "pending",
        creationDate: "2026-09-11T08:30:00Z",
        authorNickname: "Maelis",
    }),
];
