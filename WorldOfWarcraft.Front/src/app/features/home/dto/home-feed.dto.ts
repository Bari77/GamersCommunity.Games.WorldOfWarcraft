import { CharacterSummaryDto } from "@features/characters/dto/character-summary.dto";
import { GuildSummaryDto } from "@features/guilds/dto/guild-summary.dto";
import { PlayerSummaryDto } from "@features/players/dto/player-summary.dto";
import { LfgAdSummaryDto } from "./lfg-ad-summary.dto";

export interface HomeFeedDto {
    latestLfg: LfgAdSummaryDto[];
    latestCharacters: CharacterSummaryDto[];
    latestPlayers: PlayerSummaryDto[];
    latestGuilds: GuildSummaryDto[];
}
