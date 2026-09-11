import { GamePostDto, GamePostPageDto } from "@features/guilds/dto/game-post.dto";

const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

export const POST_PENDING = "pending";
export const POST_APPROVED = "approved";
export const POST_REJECTED = "rejected";

export class GamePost {
    public constructor(
        public publicId: string,
        public guildPublicId: string | null,
        public guildName: string | null,
        public guildDiscriminator: string | null,
        public body: string,
        public mediaUrl: string | null,
        public mediaKind: string | null,
        public status: string,
        public creationDate: Date,
        public authorPlayerPublicId: string,
        public authorPlatformUserPublicId: string,
        public authorNickname: string,
        public authorDiscriminator: string,
        public authorAvatarUrl: string,
        public moderationReason: string | null,
        public moderatedAt: Date | null,
    ) {}

    public static fromDto(dto: GamePostDto): GamePost {
        return new GamePost(
            dto.publicId,
            dto.guildPublicId ?? null,
            dto.guildName ?? null,
            dto.guildDiscriminator ?? null,
            dto.body,
            dto.mediaUrl ?? null,
            dto.mediaKind ?? null,
            dto.status,
            new Date(dto.creationDate),
            dto.authorPlayerPublicId,
            dto.authorPlatformUserPublicId,
            dto.authorNickname,
            dto.authorDiscriminator,
            dto.authorAvatarUrl ?? "",
            dto.moderationReason ?? null,
            dto.moderatedAt ? new Date(dto.moderatedAt) : null,
        );
    }

    public authorHandleLabel(): string {
        return `${this.authorNickname}#${this.authorDiscriminator}`;
    }

    public isContactable(): boolean {
        return !!this.authorPlatformUserPublicId && this.authorPlatformUserPublicId !== EMPTY_GUID;
    }

    public initials(): string {
        return this.authorNickname.charAt(0) || "?";
    }

    public isPending(): boolean {
        return this.status === POST_PENDING;
    }

    public isMine(playerPublicId: string | null | undefined): boolean {
        return !!playerPublicId && this.authorPlayerPublicId === playerPublicId;
    }
}

export class GamePostPage {
    public constructor(
        public items: GamePost[],
        public hasMore: boolean,
    ) {}

    public static fromDto(dto: GamePostPageDto): GamePostPage {
        return new GamePostPage((dto.items ?? []).map((item) => GamePost.fromDto(item)), dto.hasMore ?? false);
    }
}
