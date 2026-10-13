export interface GuildApplicationDto {
    publicId: string;
    message: string;
    status: string;
    creationDate: string;
    reviewedAt?: string | null;
    guildPublicId: string;
    guildName: string;
    guildDiscriminator: string;
    characterPublicId: string;
    characterPseudo: string;
    characterLevel: number;
    characterClassName: string;
    characterRaceName: string;
    characterServerName: string;
    playerPublicId: string;
    platformUserPublicId: string;
    nickname: string;
    discriminator: string;
    avatarUrl: string;
}
