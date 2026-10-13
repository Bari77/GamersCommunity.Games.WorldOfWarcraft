export interface LfgMessagePayloadDto {
    publicId: string;
    kind?: string;
    body: string;
    senderNickname: string;
    senderDiscriminator: string;
    creationDate: string;
    expiresAt?: string;
    playerPublicId: string;
    platformUserPublicId: string;
    senderAvatarUrl?: string;
    guildPublicId?: string | null;
    guildName?: string | null;
    guildDiscriminator?: string | null;
    guildCrest?: {
        emblem: number;
        emblemColor: string;
        border: number;
        borderColor: string;
        backgroundColor: string;
        faction?: string | null;
    } | null;
}
