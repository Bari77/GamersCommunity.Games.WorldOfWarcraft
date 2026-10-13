import { GuildSearchResultDto } from "@features/guilds/dto/guild-search-result.dto";
import { GuildSummary } from "./guild-summary.model";

export class GuildSearchPage {
    public constructor(
        public items: GuildSummary[],
        public hasMore: boolean,
    ) {}

    public static fromDto(dto: GuildSearchResultDto): GuildSearchPage {
        return new GuildSearchPage(
            (dto.items ?? []).map((item) => GuildSummary.fromDto(item)),
            dto.hasMore ?? false,
        );
    }
}
