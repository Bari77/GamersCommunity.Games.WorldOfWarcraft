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

export interface GamePostPageDto {
    items: GamePostDto[];
    hasMore: boolean;
}

export interface GuildWallRequestDto {
    guildPublicId: string;
    beforeCreationDate?: string;
    beforePublicId?: string;
    take?: number;
}

export interface GamePostCreateRequestDto {
    guildPublicId: string;
    body: string;
    mediaUrl?: string | null;
    mediaKind?: string | null;
    visibility?: string;
}

/** Reserved to the author, and replacing the post wholesale rather than patching it. */
export interface GamePostUpdateRequestDto {
    publicId: string;
    body: string;
    mediaUrl?: string | null;
    mediaKind?: string | null;
    visibility?: string;
}

export interface GamePostModerateRequestDto {
    publicId: string;
    approve: boolean;
    reason?: string | null;
}

export interface GamePostTargetRequestDto {
    publicId: string;
}
