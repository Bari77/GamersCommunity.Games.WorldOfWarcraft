import {
    CharacterCreateRequestDto,
    CharacterDto,
    CharacterOptionsDto,
} from "@features/characters/dto/character.dto";
import { PlayerSheetDto } from "@features/players/dto/player.dto";

export const PLAYER_PUBLIC_ID = "22222222-2222-2222-2222-222222222222";
export const PLATFORM_USER_PUBLIC_ID = "33333333-3333-3333-3333-333333333333";
const GUILD_PUBLIC_ID = "55555555-5555-5555-5555-555555555555";

export const mockPlayerSheet: PlayerSheetDto = {
    publicId: PLAYER_PUBLIC_ID,
    platformUserPublicId: PLATFORM_USER_PUBLIC_ID,
    presentationIrl: "Raid leader by night, backend developer by day.",
    presentationIg: "Pushing keys since Legion.",
    nbMount: 412,
    successPoints: 28450,
    creationDate: new Date("2024-02-11T10:00:00Z").toISOString(),
    characterCount: 2,
    layoutJson: null,
};

export const mockCharacterOptions: CharacterOptionsDto = {
    maxLevel: 80,
    races: [
        { id: 1, entitled: "human" },
        { id: 2, entitled: "orc" },
        { id: 4, entitled: "night_elf" },
        { id: 9, entitled: "blood_elf" },
        { id: 15, entitled: "dracthyr" },
    ],
    servers: [
        { id: 1, entitled: "hyjal" },
        { id: 2, entitled: "dalaran" },
        { id: 3, entitled: "elune" },
        { id: 4, entitled: "archimonde" },
    ],
    directions: [
        { id: 1, entitled: "tank" },
        { id: 2, entitled: "heal" },
        { id: 3, entitled: "dps" },
    ],
    alignments: [
        { id: 1, entitled: "alliance" },
        { id: 2, entitled: "horde" },
    ],
    classes: [
        { id: 1, entitled: "warrior" },
        { id: 2, entitled: "paladin" },
        { id: 5, entitled: "priest" },
        { id: 10, entitled: "druid" },
        { id: 11, entitled: "demon_hunter" },
        { id: 13, entitled: "evoker" },
    ],
    specializationClasses: [
        { id: 1, entitled: "warrior_arms", idClass: 1, specializationEntitled: "arms" },
        { id: 2, entitled: "warrior_fury", idClass: 1, specializationEntitled: "fury" },
        { id: 3, entitled: "warrior_protection", idClass: 1, specializationEntitled: "protection" },
        { id: 4, entitled: "paladin_holy", idClass: 2, specializationEntitled: "holy" },
        { id: 5, entitled: "paladin_protection", idClass: 2, specializationEntitled: "protection" },
        { id: 6, entitled: "paladin_retribution", idClass: 2, specializationEntitled: "retribution" },
        { id: 13, entitled: "priest_discipline", idClass: 5, specializationEntitled: "discipline" },
        { id: 14, entitled: "priest_holy", idClass: 5, specializationEntitled: "holy" },
        { id: 15, entitled: "priest_shadow", idClass: 5, specializationEntitled: "shadow" },
        { id: 28, entitled: "druid_balance", idClass: 10, specializationEntitled: "balance" },
        { id: 29, entitled: "druid_feral", idClass: 10, specializationEntitled: "feral" },
        { id: 30, entitled: "druid_guardian", idClass: 10, specializationEntitled: "guardian" },
        { id: 31, entitled: "druid_restoration", idClass: 10, specializationEntitled: "restoration" },
        { id: 32, entitled: "demon_hunter_havoc", idClass: 11, specializationEntitled: "havoc" },
        { id: 33, entitled: "demon_hunter_vengeance", idClass: 11, specializationEntitled: "vengeance" },
        { id: 37, entitled: "evoker_devastation", idClass: 13, specializationEntitled: "devastation" },
        { id: 38, entitled: "evoker_preservation", idClass: 13, specializationEntitled: "preservation" },
        { id: 39, entitled: "evoker_augmentation", idClass: 13, specializationEntitled: "augmentation" },
    ],
    raceClasses: [
        { idRace: 1, idClass: 1 },
        { idRace: 1, idClass: 2 },
        { idRace: 1, idClass: 5 },
        { idRace: 2, idClass: 1 },
        { idRace: 4, idClass: 1 },
        { idRace: 4, idClass: 5 },
        { idRace: 4, idClass: 10 },
        { idRace: 4, idClass: 11 },
        { idRace: 9, idClass: 1 },
        { idRace: 9, idClass: 2 },
        { idRace: 9, idClass: 5 },
        { idRace: 9, idClass: 11 },
        { idRace: 15, idClass: 13 },
    ],
};

export const mockCharacters: CharacterDto[] = [
    {
        publicId: "44444444-4444-4444-4444-444444444444",
        playerPublicId: PLAYER_PUBLIC_ID,
        pseudo: "Aelindra",
        level: 80,
        ilvl: 639,
        achievement: 24310,
        sentence: "Never stops moving during Mythic pulls.",
        main: true,
        creationDate: new Date("2024-03-02T18:30:00Z").toISOString(),
        idRace: 4,
        raceName: "night_elf",
        idServer: 1,
        serverName: "hyjal",
        idDirection: 2,
        directionName: "heal",
        idAlignment: 1,
        alignmentName: "alliance",
        idClass: 10,
        className: "druid",
        idMainSpecializationClass: 31,
        mainSpecializationName: "restoration",
        idSecondarySpecializationClass: 28,
        secondarySpecializationName: "balance",
        guildPublicId: GUILD_PUBLIC_ID,
        guildName: "Guardians of Azeroth",
        guildDiscriminator: "0001",
    },
    {
        publicId: "77777777-7777-7777-7777-777777777777",
        playerPublicId: PLAYER_PUBLIC_ID,
        pseudo: "Korgath",
        level: 74,
        ilvl: 512,
        achievement: 9120,
        sentence: null,
        main: false,
        creationDate: new Date("2025-01-19T09:15:00Z").toISOString(),
        idRace: 2,
        raceName: "orc",
        idServer: 4,
        serverName: "archimonde",
        idDirection: 1,
        directionName: "tank",
        idAlignment: 2,
        alignmentName: "horde",
        idClass: 1,
        className: "warrior",
        idMainSpecializationClass: 3,
        mainSpecializationName: "protection",
        idSecondarySpecializationClass: null,
        secondarySpecializationName: null,
        guildPublicId: null,
        guildName: null,
        guildDiscriminator: null,
    },
];

export function buildMockCharacter(request: CharacterCreateRequestDto, publicId: string): CharacterDto {
    const entitled = (items: { id: number; entitled: string }[], id: number | null): string =>
        items.find((item) => item.id === id)?.entitled ?? "";
    const spec = (id: number | null) => mockCharacterOptions.specializationClasses.find((item) => item.id === id);

    const mainSpec = spec(request.idMainSpecializationClass);
    const secondarySpec = spec(request.idSecondarySpecializationClass);

    return {
        publicId,
        playerPublicId: PLAYER_PUBLIC_ID,
        pseudo: request.pseudo,
        level: request.level,
        ilvl: request.ilvl,
        achievement: request.achievement,
        sentence: request.sentence,
        main: request.main,
        creationDate: new Date().toISOString(),
        idRace: request.idRace,
        raceName: entitled(mockCharacterOptions.races, request.idRace),
        idServer: request.idServer,
        serverName: entitled(mockCharacterOptions.servers, request.idServer),
        idDirection: request.idDirection,
        directionName: entitled(mockCharacterOptions.directions, request.idDirection),
        idAlignment: request.idAlignment,
        alignmentName: request.idAlignment ? entitled(mockCharacterOptions.alignments, request.idAlignment) : null,
        idClass: mainSpec?.idClass ?? null,
        className: mainSpec ? entitled(mockCharacterOptions.classes, mainSpec.idClass) : null,
        idMainSpecializationClass: request.idMainSpecializationClass,
        mainSpecializationName: mainSpec?.specializationEntitled ?? null,
        idSecondarySpecializationClass: request.idSecondarySpecializationClass,
        secondarySpecializationName: secondarySpec?.specializationEntitled ?? null,
        guildPublicId: null,
        guildName: null,
        guildDiscriminator: null,
    };
}
