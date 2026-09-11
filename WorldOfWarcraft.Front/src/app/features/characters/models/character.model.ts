import {
    CharacterDto,
    CharacterOptionsDto,
    RaceClassOptionDto,
    ReferenceItemDto,
    SpecializationClassOptionDto,
} from "@features/characters/dto/character.dto";
import { classColor } from "@features/characters/models/class-colors";

export class Character {
    public readonly publicId: string;
    public readonly playerPublicId: string;
    public readonly pseudo: string;
    public readonly level: number;
    public readonly ilvl: number;
    public readonly achievement: number;
    public readonly sentence: string | null;
    public readonly main: boolean;
    public readonly creationDate: Date;
    public readonly idRace: number;
    public readonly raceName: string;
    public readonly idServer: number;
    public readonly serverName: string;
    public readonly idDirection: number;
    public readonly directionName: string;
    public readonly idAlignment: number | null;
    public readonly alignmentName: string | null;
    public readonly idClass: number | null;
    public readonly className: string | null;
    public readonly idMainSpecializationClass: number | null;
    public readonly mainSpecializationName: string | null;
    public readonly idSecondarySpecializationClass: number | null;
    public readonly secondarySpecializationName: string | null;
    public readonly guildPublicId: string | null;
    public readonly guildName: string | null;
    public readonly guildDiscriminator: string | null;
    public readonly guildRank: string | null;

    public constructor(dto: CharacterDto) {
        this.publicId = dto.publicId;
        this.playerPublicId = dto.playerPublicId;
        this.pseudo = dto.pseudo;
        this.level = dto.level;
        this.ilvl = dto.ilvl;
        this.achievement = dto.achievement;
        this.sentence = dto.sentence;
        this.main = dto.main;
        this.creationDate = new Date(dto.creationDate);
        this.idRace = dto.idRace;
        this.raceName = dto.raceName;
        this.idServer = dto.idServer;
        this.serverName = dto.serverName;
        this.idDirection = dto.idDirection;
        this.directionName = dto.directionName;
        this.idAlignment = dto.idAlignment;
        this.alignmentName = dto.alignmentName;
        this.idClass = dto.idClass;
        this.className = dto.className;
        this.idMainSpecializationClass = dto.idMainSpecializationClass;
        this.mainSpecializationName = dto.mainSpecializationName;
        this.idSecondarySpecializationClass = dto.idSecondarySpecializationClass;
        this.secondarySpecializationName = dto.secondarySpecializationName;
        this.guildPublicId = dto.guildPublicId;
        this.guildName = dto.guildName;
        this.guildDiscriminator = dto.guildDiscriminator;
        this.guildRank = dto.guildRank ?? null;
    }

    public get color(): string {
        return classColor(this.className);
    }

    public get guildHandle(): string | null {
        return this.guildName ? `${this.guildName}#${this.guildDiscriminator}` : null;
    }

    public static fromDto(dto: CharacterDto): Character {
        return new Character(dto);
    }
}

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
