import { GuildCrestDto } from "@shared/models/guild-crest.dto";

/** Guild the player mains in, as shown on the sheet header. */
export interface PlayerGuildDto {
    publicId: string;
    entitled: string;
    discriminator: string;
    rank: string;
    crest: GuildCrestDto;
}
