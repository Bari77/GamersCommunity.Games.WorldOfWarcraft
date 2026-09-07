import { LfgMessageDto, PostableGuildDto } from "@features/lfg/dto/lfg-message.dto";
import { GuildSheetDto } from "@features/guilds/dto/guild.dto";
import { HomeFeedDto } from "@features/home/dto/home-feed.dto";

const GUILD_PUBLIC_ID = "55555555-5555-5555-5555-555555555555";

export const mockLfgMessages: LfgMessageDto[] = [
    {
        publicId: "11111111-1111-1111-1111-111111111111",
        kind: "lfg",
        body: "Need healer for +12 Streets tonight.",
        senderNickname: "Aelindra",
        senderDiscriminator: "0042",
        creationDate: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        playerPublicId: "22222222-2222-2222-2222-222222222222",
        platformUserPublicId: "33333333-3333-3333-3333-333333333333",
    },
];

export const mockRecruitmentMessages: LfgMessageDto[] = [
    {
        publicId: "66666666-6666-6666-6666-666666666666",
        kind: "recruit",
        body: "Guardians of Azeroth is recruiting ranged DPS for heroic progress.",
        senderNickname: "Aelindra",
        senderDiscriminator: "0042",
        creationDate: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        playerPublicId: "22222222-2222-2222-2222-222222222222",
        platformUserPublicId: "33333333-3333-3333-3333-333333333333",
        guildPublicId: GUILD_PUBLIC_ID,
        guildName: "Guardians of Azeroth",
        guildDiscriminator: "0001",
    },
];

export const mockPostableGuilds: PostableGuildDto[] = [
    {
        publicId: GUILD_PUBLIC_ID,
        entitled: "Guardians of Azeroth",
        discriminator: "0001",
        rank: "officer",
    },
];

export const mockGuildSheet: GuildSheetDto = {
    publicId: GUILD_PUBLIC_ID,
    entitled: "Guardians of Azeroth",
    discriminator: "0001",
    level: 25,
    sentence: "Heroic progress guild, EU evenings.",
    linkDiscord: "https://discord.gg/example",
    linkForum: null,
    serverName: "Hyjal",
    directionName: "Alliance",
    creationDate: new Date().toISOString(),
    members: [
        {
            characterPublicId: "44444444-4444-4444-4444-444444444444",
            pseudo: "Aelindra",
            level: 80,
            className: "Druid",
            raceName: "Night Elf",
            rank: "officer",
            playerPublicId: "22222222-2222-2222-2222-222222222222",
            platformUserPublicId: "33333333-3333-3333-3333-333333333333",
            nickname: "Aelindra",
            discriminator: "0042",
            avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Aelindra",
        },
    ],
};

export const mockHomeFeed: HomeFeedDto = {
    latestLfg: mockLfgMessages,
    latestCharacters: [
        {
            publicId: "44444444-4444-4444-4444-444444444444",
            pseudo: "Aelindra",
            level: 80,
            main: true,
            creationDate: new Date().toISOString(),
            playerPublicId: "22222222-2222-2222-2222-222222222222",
            serverName: "Hyjal",
            raceName: "Night Elf",
        },
    ],
    latestPlayers: [
        {
            publicId: "22222222-2222-2222-2222-222222222222",
            platformUserPublicId: "33333333-3333-3333-3333-333333333333",
            nickname: "Aelindra",
            discriminator: "0042",
            avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Aelindra",
            presentationIrl: "Casual raider, EU evenings.",
            creationDate: new Date().toISOString(),
        },
    ],
    latestGuilds: [
        {
            publicId: GUILD_PUBLIC_ID,
            entitled: "Guardians of Azeroth",
            discriminator: "0001",
            level: 25,
            creationDate: new Date().toISOString(),
            serverName: "Hyjal",
            memberCount: 1,
        },
    ],
};
