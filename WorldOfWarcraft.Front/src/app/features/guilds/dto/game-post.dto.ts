export interface GamePostDto {
    publicId: string;
    guildPublicId?: string | null;
    guildName?: string | null;
    guildDiscriminator?: string | null;
    body: string;
    mediaUrl?: string | null;
    mediaKind?: string | null;
    status: string;
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
}

export interface GamePostModerateRequestDto {
    publicId: string;
    approve: boolean;
    reason?: string | null;
}

export interface GamePostTargetRequestDto {
    publicId: string;
}
