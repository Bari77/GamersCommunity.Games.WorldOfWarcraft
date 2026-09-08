export interface CharacterDto {
    publicId: string;
    playerPublicId: string;
    pseudo: string;
    level: number;
    ilvl: number;
    achievement: number;
    sentence: string | null;
    main: boolean;
    creationDate: string;
    idRace: number;
    raceName: string;
    idServer: number;
    serverName: string;
    idDirection: number;
    directionName: string;
    idAlignment: number | null;
    alignmentName: string | null;
    idClass: number | null;
    className: string | null;
    idMainSpecializationClass: number | null;
    mainSpecializationName: string | null;
    idSecondarySpecializationClass: number | null;
    secondarySpecializationName: string | null;
    guildPublicId: string | null;
    guildName: string | null;
    guildDiscriminator: string | null;
}

export interface CharacterListRequestDto {
    playerPublicId: string;
}

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

export type CharacterUpdateRequestDto = Partial<CharacterCreateRequestDto>;

export interface ReferenceItemDto {
    id: number;
    entitled: string;
}

export interface SpecializationClassOptionDto {
    id: number;
    entitled: string;
    idClass: number;
    specializationEntitled: string;
}

export interface RaceClassOptionDto {
    idRace: number;
    idClass: number;
}

export interface CharacterOptionsDto {
    races: ReferenceItemDto[];
    servers: ReferenceItemDto[];
    directions: ReferenceItemDto[];
    alignments: ReferenceItemDto[];
    classes: ReferenceItemDto[];
    specializationClasses: SpecializationClassOptionDto[];
    raceClasses: RaceClassOptionDto[];
    maxLevel: number;
}
