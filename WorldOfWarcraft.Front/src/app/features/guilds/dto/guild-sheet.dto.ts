import { GuildCrestDto } from "@shared/models/guild-crest.dto";
import { GuildMemberDto } from "./guild.dto";

export interface GuildSheetDto {
    publicId: string;
    entitled: string;
    discriminator: string;
    level: number;
    sentence?: string | null;
    layoutJson?: string | null;
    idServer: number;
    serverName: string;
    orientationName: string;
    crest: GuildCrestDto;
    creationDate: string;
    memberCount: number;
    members: GuildMemberDto[];
    viewerRank?: string | null;
    viewerApplicationStatus?: string | null;
    viewerApplicationPublicId?: string | null;
    pendingApplicationCount?: number;
    pendingPostCount?: number;
}
