import { SpecializationClassOptionDto } from "@features/characters/dto/specialization-class-option.dto";
import { ReferenceItemDto } from "@features/characters/dto/reference-item.dto";
import { RaceClassOptionDto } from "@features/characters/dto/race-class-option.dto";
import { CharacterOptionsDto } from "@features/characters/dto/character-options.dto";

export class CharacterOptions {
    public constructor(
        public readonly races: ReferenceItemDto[],
        public readonly servers: ReferenceItemDto[],
        public readonly directions: ReferenceItemDto[],
        public readonly alignments: ReferenceItemDto[],
        public readonly classes: ReferenceItemDto[],
        public readonly specializationClasses: SpecializationClassOptionDto[],
        public readonly raceClasses: RaceClassOptionDto[],
        public readonly maxLevel: number,
        public readonly maxIlvl: number,
    ) {}

    public static fromDto(dto: CharacterOptionsDto): CharacterOptions {
        return new CharacterOptions(
            dto.races,
            dto.servers,
            dto.directions,
            dto.alignments,
            dto.classes,
            dto.specializationClasses,
            dto.raceClasses,
            dto.maxLevel,
            dto.maxIlvl,
        );
    }

    public classesForRace(idRace: number | null): ReferenceItemDto[] {
        if (idRace === null) {
            return this.classes;
        }
        const allowed = new Set(this.raceClasses.filter((rc) => rc.idRace === idRace).map((rc) => rc.idClass));
        return this.classes.filter((c) => allowed.has(c.id));
    }

    public specializationsForClass(idClass: number | null): SpecializationClassOptionDto[] {
        return idClass === null ? [] : this.specializationClasses.filter((sc) => sc.idClass === idClass);
    }
}
