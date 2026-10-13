import { GuildSummaryDto } from "./guild-summary.dto";

export interface GuildSearchResultDto {
    items: GuildSummaryDto[];
    hasMore: boolean;
}
