import { GamePostPageDto } from "@features/guilds/dto/game-post-page.dto";
import { GamePost } from "./game-post.model";

export class GamePostPage {
    public constructor(
        public items: GamePost[],
        public hasMore: boolean,
    ) {}

    public static fromDto(dto: GamePostPageDto): GamePostPage {
        return new GamePostPage(
            (dto.items ?? []).map((item) => GamePost.fromDto(item)),
            dto.hasMore ?? false,
        );
    }
}
