export interface HomeFeedDto {
    latestLfg: LfgAdSummaryDto[];
    latestCharacters: CharacterSummaryDto[];
    latestPlayers: PlayerSummaryDto[];
    latestGuilds: GuildSummaryDto[];
}

export interface LfgAdSummaryDto {
    publicId: string;
    body: string;
    senderNickname: string;
    senderDiscriminator: string;
    creationDate: string;
    expiresAt: string;
    playerPublicId: string;
    platformUserPublicId: string;
}

export interface CharacterSummaryDto {
    publicId: string;
    pseudo: string;
    level: number;
    ilvl: number;
    main: boolean;
    creationDate: string;
    playerPublicId: string;
    serverName: string;
    raceName: string;
    className: string | null;
    mainSpecializationName: string | null;
    guildPublicId: string | null;
    guildName: string | null;
    guildDiscriminator: string | null;
}

export interface PlayerSummaryDto {
    publicId: string;
    platformUserPublicId: string;
    nickname: string;
    discriminator: string;
    avatarUrl: string;
    presentationIrl: string | null;
    creationDate: string;
}

export interface GuildSummaryDto {
    publicId: string;
    entitled: string;
    discriminator: string;
    level: number;
    creationDate: string;
    serverName: string;
    memberCount: number;
}

export interface CreateLfgAdRequestDto {
    body: string;
    senderNickname?: string;
    senderDiscriminator?: string;
}
