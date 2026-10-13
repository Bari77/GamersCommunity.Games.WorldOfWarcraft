import { ReferenceItemDto } from "./reference-item.dto";
import { SpecializationClassOptionDto } from "./specialization-class-option.dto";
import { RaceClassOptionDto } from "./race-class-option.dto";

export interface CharacterOptionsDto {
    races: ReferenceItemDto[];
    servers: ReferenceItemDto[];
    directions: ReferenceItemDto[];
    alignments: ReferenceItemDto[];
    classes: ReferenceItemDto[];
    specializationClasses: SpecializationClassOptionDto[];
    raceClasses: RaceClassOptionDto[];
    maxLevel: number;
    maxIlvl: number;
}
