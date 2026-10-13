export interface GuildSearchRequestDto {
    query?: string;
    idServer?: number;
    idAlignment?: number;
    orientation?: string;
    minLevel?: number;
    minMembers?: number;
    beforeCreationDate?: string;
    beforePublicId?: string;
    take?: number;
}
