import { CharacterSearchResultDto } from "@features/characters/dto/character-search-result.dto";
import { CharacterSummary } from "./character-summary.model";

export class CharacterSearchPage {
    public constructor(
        public items: CharacterSummary[],
        public hasMore: boolean,
    ) {}

    public static fromDto(dto: CharacterSearchResultDto): CharacterSearchPage {
        return new CharacterSearchPage(
            (dto.items ?? []).map((item) => CharacterSummary.fromDto(item)),
            dto.hasMore ?? false,
        );
    }
}
