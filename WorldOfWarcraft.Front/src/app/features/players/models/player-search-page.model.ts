import { PlayerSearchResultDto } from "@features/players/dto/player-search-result.dto";
import { PlayerSummary } from "./player-summary.model";

export class PlayerSearchPage {
    public constructor(
        public items: PlayerSummary[],
        public hasMore: boolean,
    ) {}

    public static fromDto(dto: PlayerSearchResultDto): PlayerSearchPage {
        return new PlayerSearchPage(
            (dto.items ?? []).map((item) => PlayerSummary.fromDto(item)),
            dto.hasMore ?? false,
        );
    }
}
