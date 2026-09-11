import { LfgMessageDto, PostableGuildDto } from "@features/lfg/dto/lfg-message.dto";
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
        serverName: "hyjal",
        directionName: "heal",
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
        serverName: "hyjal",
        directionName: "dps",
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

export const mockHomeFeed: HomeFeedDto = {
    latestLfg: mockLfgMessages,
    latestCharacters: [
        {
            publicId: "44444444-4444-4444-4444-444444444444",
            pseudo: "Aelindra",
            level: 80,
            ilvl: 639,
            main: true,
            creationDate: new Date().toISOString(),
            playerPublicId: "22222222-2222-2222-2222-222222222222",
            serverName: "hyjal",
            raceName: "night_elf",
            className: "druid",
            mainSpecializationName: "restoration",
            guildPublicId: GUILD_PUBLIC_ID,
            guildName: "Guardians of Azeroth",
            guildDiscriminator: "0001",
        },
        {
            publicId: "44444444-4444-4444-4444-444444444445",
            pseudo: "Krogash",
            level: 80,
            ilvl: 612,
            main: false,
            creationDate: new Date().toISOString(),
            playerPublicId: "22222222-2222-2222-2222-222222222222",
            serverName: "archimonde",
            raceName: "orc",
            className: "warrior",
            mainSpecializationName: "protection",
            guildPublicId: null,
            guildName: null,
            guildDiscriminator: null,
        },
        {
            publicId: "44444444-4444-4444-4444-444444444446",
            pseudo: "Sylnara",
            level: 42,
            ilvl: 188,
            main: false,
            creationDate: new Date().toISOString(),
            playerPublicId: "22222222-2222-2222-2222-222222222222",
            serverName: "dalaran",
            raceName: "blood_elf",
            className: null,
            mainSpecializationName: null,
            guildPublicId: null,
            guildName: null,
            guildDiscriminator: null,
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
