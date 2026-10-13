import { CharacterSummary } from "@features/characters/models/character-summary.model";
import { GuildSummary } from "@features/guilds/models/guild-summary.model";
import { HomeFeedDto } from "@features/home/dto/home-feed.dto";
import { PlayerSummary } from "@features/players/models/player-summary.model";
import { LfgAdSummary } from "./lfg-ad-summary.model";

export class HomeFeed {
    public constructor(
        public latestLfg: LfgAdSummary[],
        public latestCharacters: CharacterSummary[],
        public latestPlayers: PlayerSummary[],
        public latestGuilds: GuildSummary[],
    ) {}

    public static fromDto(dto: HomeFeedDto): HomeFeed {
        return new HomeFeed(
            dto.latestLfg.map((item) => LfgAdSummary.fromDto(item)),
            dto.latestCharacters.map((item) => CharacterSummary.fromDto(item)),
            dto.latestPlayers.map((item) => PlayerSummary.fromDto(item)),
            dto.latestGuilds.map((item) => GuildSummary.fromDto(item)),
        );
    }
}
