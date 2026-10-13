export interface CharacterSearchRequestDto {
    query?: string;
    idServer?: number;
    idAlignment?: number;
    idDirection?: number;
    idClass?: number;
    minLevel?: number;
    beforeCreationDate?: string;
    beforePublicId?: string;
    take?: number;
}
