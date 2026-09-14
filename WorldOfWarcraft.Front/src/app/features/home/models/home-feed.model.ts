import { CharacterSummary } from "@features/characters/models/character.model";
import { GuildSummary } from "@features/guilds/models/guild.model";
import { HomeFeedDto, LfgAdSummaryDto } from "@features/home/dto/home-feed.dto";
import { PlayerSummary } from "@features/players/models/player.model";

export class LfgAdSummary {
    public constructor(
        public publicId: string,
        public body: string,
        public senderNickname: string,
        public senderDiscriminator: string,
        public creationDate: Date,
        public expiresAt: Date,
        public playerPublicId: string,
        public platformUserPublicId: string,
    ) {}

    public static fromDto(dto: LfgAdSummaryDto): LfgAdSummary {
        return new LfgAdSummary(
            dto.publicId,
            dto.body,
            dto.senderNickname,
            dto.senderDiscriminator,
            new Date(dto.creationDate),
            new Date(dto.expiresAt),
            dto.playerPublicId,
            dto.platformUserPublicId,
        );
    }
}

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
