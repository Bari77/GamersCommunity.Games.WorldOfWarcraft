import { CharacterSummaryDto } from "@features/characters/dto/character.dto";
import { GuildSummaryDto } from "@features/guilds/dto/guild.dto";
import { PlayerSummaryDto } from "@features/players/dto/player.dto";

export interface HomeFeedDto {
    latestLfg: LfgAdSummaryDto[];
    latestCharacters: CharacterSummaryDto[];
    latestPlayers: PlayerSummaryDto[];
    latestGuilds: GuildSummaryDto[];
}

export interface LfgAdSummaryDto {
    publicId: string;
    body: string;
    senderNickname: string;
    senderDiscriminator: string;
    creationDate: string;
    expiresAt: string;
    playerPublicId: string;
    platformUserPublicId: string;
}

export interface CreateLfgAdRequestDto {
    body: string;
    senderNickname?: string;
    senderDiscriminator?: string;
}
