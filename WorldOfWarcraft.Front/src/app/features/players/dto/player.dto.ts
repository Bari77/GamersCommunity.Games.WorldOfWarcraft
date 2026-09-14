import { GuildCrestDto } from "@shared/models/guild-crest";

/** Guild the player mains in, as shown on the sheet header. */
export interface PlayerGuildDto {
    publicId: string;
    entitled: string;
    discriminator: string;
    rank: string;
    crest: GuildCrestDto;
}

/**
 * Optional rather than nullable on every field the back may leave empty: its serializer omits null
 * properties, so they reach the client as undefined. Models normalize them.
 */
export interface PlayerSheetDto {
    publicId: string;
    platformUserPublicId: string;
    nickname: string;
    discriminator: string;
    avatarUrl: string;
    presentationIrl?: string | null;
    presentationIg?: string | null;
    nbMount: number;
    successPoints?: number | null;
    creationDate: string;
    characterCount: number;
    layoutJson?: string | null;
    guild?: PlayerGuildDto | null;
}

export interface PlayerSummaryDto {
    publicId: string;
    platformUserPublicId: string;
    nickname: string;
    discriminator: string;
    avatarUrl: string;
    presentationIrl?: string | null;
    creationDate: string;
    characterCount: number;
}

export interface PlayerSearchRequestDto {
    query?: string;
    idServer?: number;
    beforeCreationDate?: string;
    beforePublicId?: string;
    take?: number;
}

export interface PlayerSearchResultDto {
    items: PlayerSummaryDto[];
    hasMore: boolean;
}

export interface PlayerResolveResultDto {
    playerPublicId?: string | null;
    hasSheet: boolean;
}

export interface PlayerLoadRequestDto {
    platformUserId: number;
    platformUserPublicId: string;
}

/** Only the fields present are saved, so a widget may send a single one of them. */
export interface PlayerUpdateRequestDto {
    presentationIrl?: string | null;
    presentationIg?: string | null;
    nbMount?: number;
    successPoints?: number | null;
    layoutJson?: string | null;
}
