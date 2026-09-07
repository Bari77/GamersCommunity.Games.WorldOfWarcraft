export interface GuildMemberDto {
    characterPublicId: string;
    pseudo: string;
    level: number;
    className: string;
    raceName: string;
    rank: string;
    playerPublicId: string;
    platformUserPublicId: string;
    nickname: string;
    discriminator: string;
    avatarUrl: string;
}

export interface GuildSheetDto {
    publicId: string;
    entitled: string;
    discriminator: string;
    level: number;
    sentence: string | null;
    linkDiscord: string | null;
    linkForum: string | null;
    serverName: string;
    directionName: string;
    creationDate: string;
    members: GuildMemberDto[];
}
