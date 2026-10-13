export interface CharacterCreateRequestDto {
    pseudo: string;
    level: number;
    ilvl: number;
    achievement: number;
    sentence: string | null;
    main: boolean;
    idRace: number;
    idServer: number;
    idDirection: number;
    idAlignment: number | null;
    idMainSpecializationClass: number | null;
    idSecondarySpecializationClass: number | null;
}
