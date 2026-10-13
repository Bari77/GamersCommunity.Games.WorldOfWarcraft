import { GuildCrestDto } from "@shared/models/guild-crest.dto";

export interface GuildSummaryDto {
    publicId: string;
    entitled: string;
    discriminator: string;
    level: number;
    creationDate: string;
    serverName: string;
    memberCount: number;
    sentence?: string | null;
    alignmentName?: string | null;
    orientationName?: string | null;
    crest?: GuildCrestDto | null;
}
