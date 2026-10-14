import { GamePostDto } from "@features/guilds/dto/game-post.dto";
import { GuildApplicationDto } from "@features/guilds/dto/guild-application.dto";
import { GuildMemberDto } from "@features/guilds/dto/guild.dto";
import { GuildSummaryDto } from "@features/guilds/dto/guild-summary.dto";
import { GuildSheetDto } from "@features/guilds/dto/guild-sheet.dto";
import { mockCharacters } from "./characters";
import {
    ASHEN_CREST,
    BLACKROCK_CREST,
    EMBERHOLD_CREST,
    GUARDIANS_CREST,
    MOONWELL_CREST,
    mockCrest,
    mockRandom,
    pickOne,
    STORMWATCH_CREST,
} from "./guild-crests";
import { characterPublicId, mockUuid, WOW_GUILD_IDS } from "./ids";
import { MOCK_PERSONAS, mockPortraitUrl, persona } from "./personas";

export const GUILD_PUBLIC_ID = WOW_GUILD_IDS.guardians;
export const BLACKROCK_ID = WOW_GUILD_IDS.blackrock;
export const MOONWELL_ID = WOW_GUILD_IDS.moonwell;
export const ASHEN_ID = WOW_GUILD_IDS.ashen;
export const STORMWATCH_ID = WOW_GUILD_IDS.stormwatch;
export const EMBERHOLD_ID = WOW_GUILD_IDS.emberhold;

function member(charId: string, rank: string, joinedAt: string): GuildMemberDto {
    const character = mockCharacters.find((item) => item.publicId === charId);
    if (!character) {
        throw new Error(`Unknown mock character ${charId}`);
    }
    const who = MOCK_PERSONAS.find((persona) => persona.playerPublicId === character.playerPublicId);
    if (!who) {
        throw new Error(`Unknown mock persona for character ${charId}`);
    }

    return {
        characterPublicId: charId,
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
    crest: GUARDIANS_CREST,
    creationDate: new Date("2024-11-02T18:00:00Z").toISOString(),
    memberCount: 4,
    viewerRank: "leader",
    viewerApplicationStatus: null,
    viewerApplicationPublicId: null,
    pendingApplicationCount: 1,
    pendingPostCount: 1,
    members: [
        member(characterPublicId("44"), "leader", "2024-11-02T18:05:00Z"),
        member(characterPublicId("4a"), "officer", "2024-11-02T18:00:00Z"),
        member(characterPublicId("4e"), "member", "2024-12-10T19:00:00Z"),
        member(characterPublicId("68"), "member", "2025-02-01T19:20:00Z"),
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
        sentence:
            "<p>Heroic progress guild looking for committed raiders who can show up on <em>EU evenings</em>, learn the fights, and keep the mood high even when the wipe count climbs.</p>",
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
        crest: BLACKROCK_CREST,
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
        crest: MOONWELL_CREST,
    },
    {
        publicId: ASHEN_ID,
        entitled: "Ashen Covenant",
        discriminator: "0204",
        level: 16,
        creationDate: new Date("2025-04-21T19:00:00Z").toISOString(),
        serverName: "dalaran",
        memberCount: 3,
        sentence: "Heroic raids, Horde, Dalaran.",
        alignmentName: "horde",
        orientationName: "pvpe",
        crest: ASHEN_CREST,
    },
    {
        publicId: STORMWATCH_ID,
        entitled: "Stormwatch Keep",
        discriminator: "0312",
        level: 20,
        creationDate: new Date("2025-05-18T17:30:00Z").toISOString(),
        serverName: "hyjal",
        memberCount: 3,
        sentence: "Alliance heroic + M+, Hyjal evenings.",
        alignmentName: "alliance",
        orientationName: "pvpe",
        crest: STORMWATCH_CREST,
    },
    {
        publicId: EMBERHOLD_ID,
        entitled: "Emberhold Pact",
        discriminator: "0559",
        level: 19,
        creationDate: new Date("2025-03-28T20:00:00Z").toISOString(),
        serverName: "archimonde",
        memberCount: 3,
        sentence: "Horde progress raids, Archimonde.",
        alignmentName: "horde",
        orientationName: "pve",
        crest: EMBERHOLD_CREST,
    },
];

const BLACKROCK = mockGuildSummaries[1];
const MOONWELL = mockGuildSummaries[2];
const ASHEN = mockGuildSummaries[3];
const STORMWATCH = mockGuildSummaries[4];
const EMBERHOLD = mockGuildSummaries[5];

function extraSheet(summary: GuildSummaryDto, members: GuildMemberDto[]): GuildSheetDto {
    return {
        publicId: summary.publicId,
        entitled: summary.entitled,
        discriminator: summary.discriminator,
        level: summary.level,
        sentence: summary.sentence,
        layoutJson: null,
        idServer:
            summary.serverName === "archimonde"
                ? 4
                : summary.serverName === "elune"
                  ? 3
                  : summary.serverName === "dalaran"
                    ? 2
                    : 1,
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
        member(characterPublicId("45"), "leader", "2025-02-14T20:35:00Z"),
        member(characterPublicId("4f"), "officer", "2025-03-02T18:00:00Z"),
        member(characterPublicId("53"), "member", "2025-08-19T21:10:00Z"),
    ]),
    [MOONWELL.publicId]: extraSheet(MOONWELL, [
        member(characterPublicId("4c"), "leader", "2025-06-04T12:05:00Z"),
        member(characterPublicId("50"), "member", "2026-01-13T10:00:00Z"),
    ]),
    [ASHEN.publicId]: extraSheet(ASHEN, [
        member(characterPublicId("4d"), "leader", "2025-04-21T19:10:00Z"),
        member(characterPublicId("57"), "member", "2025-09-03T18:40:00Z"),
        member(characterPublicId("67"), "member", "2025-12-01T17:00:00Z"),
    ]),
    [STORMWATCH.publicId]: extraSheet(STORMWATCH, [
        member(characterPublicId("5d"), "leader", "2025-05-18T17:40:00Z"),
        member(characterPublicId("5f"), "officer", "2025-07-04T20:30:00Z"),
        member(characterPublicId("60"), "member", "2025-09-23T23:00:00Z"),
    ]),
    [EMBERHOLD.publicId]: extraSheet(EMBERHOLD, [
        member(characterPublicId("61"), "leader", "2025-03-28T20:10:00Z"),
        member(characterPublicId("63"), "officer", "2025-04-13T18:20:00Z"),
        member(characterPublicId("66"), "member", "2025-08-08T21:15:00Z"),
    ]),
};

const FILL_GUILDS = [
    "Silverwake",
    "Duskwell Order",
    "Runehold",
    "Cinder March",
    "Pale Banner",
    "Thornpeak",
    "Nightglass",
    "Amber Vow",
    "Frostspire",
    "Redfen Company",
    "Moonshard",
    "Ironveil",
    "Starforged",
    "Hollow Crown",
    "Brightmaw",
    "Ashen Tide",
    "Wyrmrest Watch",
    "Gloam Pact",
    "Sunken Hall",
    "Verdant Spear",
    "Blackwater Kin",
    "Oathbreakers",
    "Lark and Lance",
    "Emberfen",
    "Quiet Rampart",
    "Goldleaf Circle",
    "Ravenmark",
    "Saltwind",
    "Deepbarrow",
    "Kindled Oath",
    "Mistwall",
    "Hearthbound",
    "Crimson Loom",
    "Northglass",
    "Wilder Covenant",
    "Last Lantern",
];

/**
 * Alliance / Horde seats per realm for the fill guilds. Together with the handcrafted guilds every
 * realm hosts both factions and the whole directory lands on an even split.
 */
const FILL_REALM_SEATS: Record<string, [alliance: number, horde: number]> = {
    hyjal: [4, 5],
    dalaran: [5, 4],
    elune: [4, 5],
    archimonde: [5, 4],
};

const FILL_ORIENTATIONS = ["pve", "pve", "pve", "pvpe", "pvpe", "pvpe", "pvp", "pvp"] as const;

const FILL_SENTENCES = [
    "Chill raiding twice a week, no drama, lots of bad jokes on voice.",
    "AOTC every tier, CE when the stars align. Wed/Thu 20:45-23:30.",
    "Mythic+ crew pushing 12s and above. Bring your own snacks.",
    "Family guild since Wrath. Alts welcome, parents with toddlers too.",
    "Rated BGs on Friday nights, world PvP whenever someone pings.",
    "Looking for a resto shaman and a ranged DPS for heroic progress!",
    "Small group of friends, we level alts and farm mounts.",
    "Semi-hardcore. Logs are checked, but we still laugh at wipes.",
    "French / English speaking, raid leader is patient (most days).",
    "Weekend warriors: Saturday heroic, Sunday keys.",
    "Old school RP-PvE guild. Tavern nights every first Friday.",
    "Recruiting all roles for next season, apply on Discord.",
    "Transmog addicts and pet battle enjoyers.",
    "Cutting edge focused, 3 nights, attendance matters.",
    "We just reformed after a break, rebuilding the roster from scratch.",
    "Arena 2v2/3v3 practice, coaching for newer players.",
    "Mostly night owls, raids start at 22:00 server time.",
    "Achievement hunters. Yes, we still do old raids for the mounts.",
];

const randomSeats = mockRandom("wow:fill-guild-seats");
const fillSeats = Object.entries(FILL_REALM_SEATS)
    .flatMap(([serverName, [alliance, horde]]) => [
        ...Array.from({ length: alliance }, () => ({ serverName, faction: "alliance" })),
        ...Array.from({ length: horde }, () => ({ serverName, faction: "horde" })),
    ])
    .map((seat) => ({ seat, order: randomSeats() }))
    .sort((left, right) => left.order - right.order)
    .map(({ seat }) => seat);

if (fillSeats.length !== FILL_GUILDS.length) {
    throw new Error(`Fill guild seats (${fillSeats.length}) must match fill guilds (${FILL_GUILDS.length})`);
}

const FILL_START = Date.UTC(2019, 0, 1);
const FILL_END = Date.UTC(2026, 8, 30);

for (const [index, entitled] of FILL_GUILDS.entries()) {
    const { serverName, faction } = fillSeats[index];
    const random = mockRandom(`wow:fill-guild:${entitled}`);
    const created = new Date(FILL_START + Math.floor(random() * (FILL_END - FILL_START)));
    created.setUTCHours(8 + Math.floor(random() * 16), Math.floor(random() * 60), 0, 0);
    const summary: GuildSummaryDto = {
        publicId: mockUuid(`wow:guild:${entitled}`),
        entitled,
        discriminator: String(1 + Math.floor(random() * 9998)).padStart(4, "0"),
        level: 1 + Math.floor(random() * 30),
        creationDate: created.toISOString(),
        serverName,
        memberCount: Math.round(3 + random() ** 2.2 * 220),
        sentence: random() < 0.2 ? null : pickOne(random, FILL_SENTENCES),
        alignmentName: faction,
        orientationName: pickOne(random, FILL_ORIENTATIONS),
        crest: mockCrest(entitled, faction),
    };
    mockGuildSummaries.push(summary);
    const sheet = extraSheet(summary, []);
    sheet.memberCount = summary.memberCount;
    extraGuildSheets[summary.publicId] = sheet;
}

export function guildSheetByPublicId(publicId: string, current: GuildSheetDto): GuildSheetDto | null {
    if (publicId === current.publicId) {
        return current;
    }
    return extraGuildSheets[publicId] ?? null;
}

export const mockGuildApplications: GuildApplicationDto[] = [
    {
        publicId: mockUuid("wow:org-row:88888888-8888-8888-8888-888888888888"),
        message: "Disc priest, 8/8 heroic cleared, looking for a mythic roster.",
        status: "pending",
        creationDate: new Date("2026-09-08T19:12:00Z").toISOString(),
        reviewedAt: null,
        guildPublicId: GUILD_PUBLIC_ID,
        guildName: "Guardians of Azeroth",
        guildDiscriminator: "0001",
        characterPublicId: characterPublicId("4b"),
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
    const who = persona(opts.authorNickname);

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
        authorPlayerPublicId: who.playerPublicId,
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
        publicId: mockUuid("wow:org-row:99999999-9999-9999-9999-999999999999"),
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
        publicId: mockUuid("wow:org-row:99999999-9999-9999-9999-99999999999b"),
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
        publicId: mockUuid("wow:org-row:99999999-9999-9999-9999-99999999999c"),
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
        publicId: mockUuid("wow:org-row:99999999-9999-9999-9999-99999999999d"),
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
        publicId: mockUuid("wow:org-row:99999999-9999-9999-9999-99999999999e"),
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
        publicId: mockUuid("wow:org-row:99999999-9999-9999-9999-99999999999f"),
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
    wallPost({
        publicId: mockUuid("wow:org-row:99999999-9999-9999-9999-9999999999a0"),
        guildPublicId: STORMWATCH_ID,
        guildName: "Stormwatch Keep",
        guildDiscriminator: "0312",
        body: "Stormwatch mythic signup is live. Healers and a second tank preferred.",
        visibility: "public",
        status: "approved",
        creationDate: "2026-09-14T18:30:00Z",
        authorNickname: "Dravenor",
        moderatedAt: "2026-09-14T18:30:00Z",
    }),
    wallPost({
        publicId: mockUuid("wow:org-row:99999999-9999-9999-9999-9999999999a1"),
        guildPublicId: STORMWATCH_ID,
        guildName: "Stormwatch Keep",
        guildDiscriminator: "0312",
        body: "Consumables run Thursday before raid. Bring herbs if you have them.",
        visibility: "member",
        status: "approved",
        creationDate: "2026-09-13T21:00:00Z",
        authorNickname: "Isendre",
        moderatedAt: "2026-09-13T21:00:00Z",
    }),
    wallPost({
        publicId: mockUuid("wow:org-row:99999999-9999-9999-9999-9999999999a2"),
        guildPublicId: EMBERHOLD_ID,
        guildName: "Emberhold Pact",
        guildDiscriminator: "0559",
        body: "Emberhold clears heroic Wed/Sun. Looking for one more melee.",
        visibility: "public",
        status: "approved",
        creationDate: "2026-09-12T20:15:00Z",
        authorNickname: "Lythara",
        moderatedAt: "2026-09-12T20:15:00Z",
    }),
    wallPost({
        publicId: mockUuid("wow:org-row:99999999-9999-9999-9999-9999999999a3"),
        guildPublicId: EMBERHOLD_ID,
        guildName: "Emberhold Pact",
        guildDiscriminator: "0559",
        body: "Tank markers updated for this week. Read the notes before pull.",
        visibility: "member",
        status: "approved",
        creationDate: "2026-09-11T19:00:00Z",
        authorNickname: "Bramdor",
        moderatedAt: "2026-09-11T19:00:00Z",
    }),
    wallPost({
        publicId: mockUuid("wow:org-row:99999999-9999-9999-9999-9999999999a4"),
        guildPublicId: ASHEN_ID,
        guildName: "Ashen Covenant",
        guildDiscriminator: "0204",
        body: "World quest blitz tomorrow after reset. Hunters bring the snacks.",
        visibility: "member",
        status: "approved",
        creationDate: "2026-09-10T15:30:00Z",
        authorNickname: "Fenrisa",
        moderatedAt: "2026-09-10T15:40:00Z",
    }),
];

export const mockPendingPosts: GamePostDto[] = [
    wallPost({
        publicId: mockUuid("wow:org-row:99999999-9999-9999-9999-99999999999a"),
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
