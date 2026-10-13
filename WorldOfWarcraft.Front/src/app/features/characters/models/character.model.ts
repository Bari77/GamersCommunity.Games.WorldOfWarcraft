import { CharacterDto } from "@features/characters/dto/character.dto";
import { classColor } from "@features/characters/models/class-colors";
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
