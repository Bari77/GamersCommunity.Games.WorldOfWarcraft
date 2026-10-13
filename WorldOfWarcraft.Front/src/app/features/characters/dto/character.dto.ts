import { GuildCrestDto } from "@shared/models/guild-crest.dto";
import { CharacterCreateRequestDto } from "./character-create-request.dto";

/**
 * Optional rather than nullable on every field the back may leave empty: its serializer omits null
 * properties, so they reach the client as undefined. Models normalize them.
 */
export interface CharacterDto {
    publicId: string;
    playerPublicId: string;
    pseudo: string;
    level: number;
    ilvl: number;
    achievement: number;
    sentence?: string | null;
    main: boolean;
    creationDate: string;
    idRace: number;
    raceName: string;
    idServer: number;
    serverName: string;
    idDirection: number;
    directionName: string;
    idAlignment?: number | null;
    alignmentName?: string | null;
    idClass?: number | null;
    className?: string | null;
    idMainSpecializationClass?: number | null;
    mainSpecializationName?: string | null;
    idSecondarySpecializationClass?: number | null;
    secondarySpecializationName?: string | null;
    guildPublicId?: string | null;
    guildName?: string | null;
    guildDiscriminator?: string | null;
    guildRank?: string | null;
    guildCrest?: GuildCrestDto | null;
}

export type CharacterUpdateRequestDto = Partial<CharacterCreateRequestDto>;
