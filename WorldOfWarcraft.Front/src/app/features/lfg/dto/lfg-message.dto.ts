export interface LfgMessageDto {
    publicId: string;
    kind: string;
    body: string;
    senderNickname: string;
    senderDiscriminator: string;
    creationDate: string;
    expiresAt: string;
    playerPublicId: string;
    platformUserPublicId: string;
    senderAvatarUrl?: string;
    guildPublicId?: string | null;
    guildName?: string | null;
    guildDiscriminator?: string | null;
    serverName?: string | null;
    directionName?: string | null;
}

export interface SearchLfgRequestDto {
    kind: string;
    query?: string;
    idServer?: number;
    idDirection?: number;
    beforeCreationDate?: string;
    beforePublicId?: string;
    take?: number;
}

export interface LfgAdPageDto {
    items: LfgMessageDto[];
    hasMore: boolean;
}

export interface ListLfgBeforeRequestDto {
    kind: string;
    beforeCreationDate: string;
    beforePublicId: string;
    take?: number;
}

export interface CreateLfgMessageRequestDto {
    body: string;
    platformUserId?: number;
    platformUserPublicId?: string;
    guildPublicId?: string;
}

export interface PostableGuildDto {
    publicId: string;
    entitled: string;
    discriminator: string;
    rank: string;
}
