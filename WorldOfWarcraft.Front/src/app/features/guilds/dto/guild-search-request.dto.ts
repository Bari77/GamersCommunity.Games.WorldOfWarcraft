export interface GuildSearchRequestDto {
    query?: string;
    idServer?: number;
    idAlignment?: number;
    beforeCreationDate?: string;
    beforePublicId?: string;
    take?: number;
}
