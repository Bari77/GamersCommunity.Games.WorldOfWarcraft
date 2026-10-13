export interface PlayerSearchRequestDto {
    query?: string;
    idServer?: number;
    idAlignment?: number;
    idClass?: number;
    idRace?: number;
    idDirection?: number;
    idSpecializationClass?: number;
    minLevel?: number;
    minIlvl?: number;
    inGuild?: boolean;
    beforeCreationDate?: string;
    beforePublicId?: string;
    take?: number;
}
