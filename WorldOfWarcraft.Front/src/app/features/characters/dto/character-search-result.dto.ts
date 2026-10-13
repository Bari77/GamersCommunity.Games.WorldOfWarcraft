import { CharacterSummaryDto } from "./character-summary.dto";

export interface CharacterSearchResultDto {
    items: CharacterSummaryDto[];
    hasMore: boolean;
}
