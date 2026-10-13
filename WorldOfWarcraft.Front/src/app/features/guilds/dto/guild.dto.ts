export interface GuildMemberDto {
    characterPublicId: string;
    pseudo: string;
    level: number;
    ilvl: number;
    className: string;
    raceName: string;
    mainSpecializationName?: string | null;
    directionName?: string | null;
    rank: string;
    playerPublicId: string;
    platformUserPublicId: string;
    nickname: string;
    discriminator: string;
    avatarUrl: string;
    joinedAt: string;
}
