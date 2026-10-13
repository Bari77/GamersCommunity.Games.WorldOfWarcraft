import { PlayerSummaryDto } from "./player-summary.dto";

export interface PlayerSearchResultDto {
    items: PlayerSummaryDto[];
    hasMore: boolean;
}
