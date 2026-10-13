export interface CharacterSearchRequestDto {
    query?: string;
    idServer?: number;
    idAlignment?: number;
    idDirection?: number;
    idClass?: number;
    idRace?: number;
    idSpecializationClass?: number;
    minLevel?: number;
    minIlvl?: number;
    mainOnly?: boolean;
    inGuild?: boolean;
    beforeCreationDate?: string;
    beforePublicId?: string;
    take?: number;
}
