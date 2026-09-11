import { LfgMessageDto, PostableGuildDto } from "@features/lfg/dto/lfg-message.dto";

const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

export type LfgKind = "lfg" | "recruit";

export const LFG_KIND_PLAYER: LfgKind = "lfg";
export const LFG_KIND_RECRUITMENT: LfgKind = "recruit";

export class LfgMessage {
    public constructor(
        public publicId: string,
        public kind: string,
        public body: string,
        public senderNickname: string,
        public senderDiscriminator: string,
        public creationDate: Date,
        public expiresAt: Date,
        public playerPublicId: string,
        public platformUserPublicId: string,
        public senderAvatarUrl: string,
        public guildPublicId: string | null,
        public guildName: string | null,
        public guildDiscriminator: string | null,
        public serverName: string | null,
        public directionName: string | null,
    ) {}

    public static fromDto(dto: LfgMessageDto): LfgMessage {
        return new LfgMessage(
            dto.publicId,
            dto.kind,
            dto.body,
            dto.senderNickname,
            dto.senderDiscriminator,
            new Date(dto.creationDate),
            new Date(dto.expiresAt),
            dto.playerPublicId,
            dto.platformUserPublicId,
            dto.senderAvatarUrl ?? "",
            dto.guildPublicId ?? null,
            dto.guildName ?? null,
            dto.guildDiscriminator ?? null,
            dto.serverName ?? null,
            dto.directionName ?? null,
        );
    }

    public isGuildAd(): boolean {
        return this.kind === LFG_KIND_RECRUITMENT && !!this.guildPublicId;
    }

    /**
     * Guild ads are displayed under the guild handle; the author stays reachable through
     * {@link playerPublicId} for moderation.
     */
    public handleLabel(): string {
        return this.isGuildAd()
            ? `${this.guildName}#${this.guildDiscriminator}`
            : `${this.senderNickname}#${this.senderDiscriminator}`;
    }

    public initial(): string {
        return this.handleLabel().charAt(0);
    }

    public hasPlatformProfile(): boolean {
        return !!this.platformUserPublicId && this.platformUserPublicId !== EMPTY_GUID;
    }

    public isMine(sessionPublicId: string | null | undefined, playerPublicId?: string | null): boolean {
        if (playerPublicId && this.playerPublicId === playerPublicId) {
            return true;
        }
        return !!sessionPublicId && this.hasPlatformProfile() && this.platformUserPublicId === sessionPublicId;
    }
}

export class PostableGuild {
    public constructor(
        public publicId: string,
        public entitled: string,
        public discriminator: string,
        public rank: string,
    ) {}

    public static fromDto(dto: PostableGuildDto): PostableGuild {
        return new PostableGuild(dto.publicId, dto.entitled, dto.discriminator, dto.rank);
    }

    public handleLabel(): string {
        return `${this.entitled}#${this.discriminator}`;
    }
}
