import { GuildCrestDto } from "@shared/models/guild-crest";

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

export interface GuildSheetDto {
    publicId: string;
    entitled: string;
    discriminator: string;
    level: number;
    sentence?: string | null;
    layoutJson?: string | null;
    serverName: string;
    orientationName: string;
    crest: GuildCrestDto;
    creationDate: string;
    memberCount: number;
    members: GuildMemberDto[];
    viewerRank?: string | null;
    viewerApplicationStatus?: string | null;
    viewerApplicationPublicId?: string | null;
    pendingApplicationCount?: number;
    pendingPostCount?: number;
}

export interface GuildSummaryDto {
    publicId: string;
    entitled: string;
    discriminator: string;
    level: number;
    creationDate: string;
    serverName: string;
    memberCount: number;
    sentence?: string | null;
    alignmentName?: string | null;
    orientationName?: string | null;
    crest?: GuildCrestDto | null;
}

export interface GuildSearchRequestDto {
    query?: string;
    idServer?: number;
    idAlignment?: number;
    beforeCreationDate?: string;
    beforePublicId?: string;
    take?: number;
}

export interface GuildSearchResultDto {
    items: GuildSummaryDto[];
    hasMore: boolean;
}

export interface GuildCreateRequestDto {
    entitled: string;
    founderCharacterPublicId: string;
    sentence?: string | null;
    orientation?: string;
}

export interface GuildUpdateRequestDto {
    sentence?: string | null;
    level?: number;
    orientation?: string;
    crest?: GuildCrestDto;

    /** Only the leader may send this one; officers get a 403. */
    layoutJson?: string | null;
}

export interface GuildMemberTargetRequestDto {
    guildPublicId: string;
    characterPublicId: string;
}

export interface GuildSetRankRequestDto extends GuildMemberTargetRequestDto {
    rank: string;
}

export interface GuildDisbandRequestDto {
    guildPublicId: string;
    confirmation: string;
}

export interface GuildLeaveResultDto {
    guildPublicId: string;
    characterPublicId: string;
}

export interface GuildDisbandResultDto {
    publicId: string;
    handle: string;
}
