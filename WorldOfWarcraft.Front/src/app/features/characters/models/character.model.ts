import {
    CharacterDto,
    CharacterOptionsDto,
    CharacterSummaryDto,
    RaceClassOptionDto,
    ReferenceItemDto,
    SpecializationClassOptionDto,
} from "@features/characters/dto/character.dto";
import { classColor } from "@features/characters/models/class-colors";
import { roleLabel, specKey, specRole, WowRole } from "@features/characters/models/spec-roles";
import { WowIconKind } from "@shared/components/wow-icon/wow-icon.component";
import { GuildCrest } from "@shared/models/guild-crest";

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
    public readonly guildCrest: GuildCrest | null;

    /**
     * Every nullable field goes through `?? null`: the API drops null properties from its payloads,
     * so they arrive undefined and a `=== null` test on them would never hold.
     */
    public constructor(dto: CharacterDto) {
        this.publicId = dto.publicId;
        this.playerPublicId = dto.playerPublicId;
        this.pseudo = dto.pseudo;
        this.level = dto.level;
        this.ilvl = dto.ilvl;
        this.achievement = dto.achievement;
        this.sentence = dto.sentence ?? null;
        this.main = dto.main;
        this.creationDate = new Date(dto.creationDate);
        this.idRace = dto.idRace;
        this.raceName = dto.raceName;
        this.idServer = dto.idServer;
        this.serverName = dto.serverName;
        this.idDirection = dto.idDirection;
        this.directionName = dto.directionName;
        this.idAlignment = dto.idAlignment ?? null;
        this.alignmentName = dto.alignmentName ?? null;
        this.idClass = dto.idClass ?? null;
        this.className = dto.className ?? null;
        this.idMainSpecializationClass = dto.idMainSpecializationClass ?? null;
        this.mainSpecializationName = dto.mainSpecializationName ?? null;
        this.idSecondarySpecializationClass = dto.idSecondarySpecializationClass ?? null;
        this.secondarySpecializationName = dto.secondarySpecializationName ?? null;
        this.guildPublicId = dto.guildPublicId ?? null;
        this.guildName = dto.guildName ?? null;
        this.guildDiscriminator = dto.guildDiscriminator ?? null;
        this.guildRank = dto.guildRank ?? null;
        this.guildCrest = dto.guildCrest ? GuildCrest.fromDto(dto.guildCrest) : null;
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

export class CharacterSummary {
    public constructor(
        public publicId: string,
        public pseudo: string,
        public level: number,
        public ilvl: number,
        public main: boolean,
        public creationDate: Date,
        public playerPublicId: string,
        public serverName: string,
        public raceName: string,
        public className: string | null,
        public mainSpecializationName: string | null,
        public guildPublicId: string | null,
        public guildName: string | null,
        public guildDiscriminator: string | null,
    ) {}

    public static fromDto(dto: CharacterSummaryDto): CharacterSummary {
        return new CharacterSummary(
            dto.publicId,
            dto.pseudo,
            dto.level,
            dto.ilvl,
            dto.main,
            new Date(dto.creationDate),
            dto.playerPublicId,
            dto.serverName,
            dto.raceName,
            dto.className ?? null,
            dto.mainSpecializationName ?? null,
            dto.guildPublicId ?? null,
            dto.guildName ?? null,
            dto.guildDiscriminator ?? null,
        );
    }

    public get color(): string {
        return classColor(this.className);
    }

    public get guildHandle(): string | null {
        return this.guildName ? `${this.guildName}#${this.guildDiscriminator}` : null;
    }

    public emblem(): { kind: WowIconKind; slug: string | null } {
        return { kind: "class", slug: this.className };
    }

    public specKey(): string | null {
        return specKey(this.className, this.mainSpecializationName);
    }

    public role(): WowRole | null {
        return specRole(this.specKey());
    }

    public roleName(): string {
        const role = this.role();
        return role ? roleLabel(role) : "";
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
