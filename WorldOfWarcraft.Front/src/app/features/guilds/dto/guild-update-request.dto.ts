import { GuildCrestDto } from "@shared/models/guild-crest.dto";

export interface GuildUpdateRequestDto {
    entitled?: string;
    sentence?: string | null;
    level?: number;
    orientation?: string;
    idServer?: number;
    crest?: GuildCrestDto;

    /** Only the leader may send this one; officers get a 403. */
    layoutJson?: string | null;
}
