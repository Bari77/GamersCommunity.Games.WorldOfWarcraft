export interface GamePostDto {
    publicId: string;
    guildPublicId?: string | null;
    guildName?: string | null;
    guildDiscriminator?: string | null;
    body: string;
    mediaUrl?: string | null;
    mediaKind?: string | null;
    status: string;

    /** `public`, or the lowest guild rank allowed to read the post. */
    visibility?: string;

    creationDate: string;
    authorPlayerPublicId: string;
    authorPlatformUserPublicId: string;
    authorNickname: string;
    authorDiscriminator: string;
    authorAvatarUrl: string;
    moderationReason?: string | null;
    moderatedAt?: string | null;
}
