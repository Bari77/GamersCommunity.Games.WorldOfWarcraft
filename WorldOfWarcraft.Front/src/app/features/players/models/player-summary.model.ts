import { PlayerSummaryDto } from "@features/players/dto/player-summary.dto";

export class PlayerSummary {
    public constructor(
        public publicId: string,
        public platformUserPublicId: string,
        public nickname: string,
        public discriminator: string,
        public avatarUrl: string,
        public presentationIrl: string | null,
        public creationDate: Date,
        public characterCount: number,
    ) {}

    public static fromDto(dto: PlayerSummaryDto): PlayerSummary {
        return new PlayerSummary(
            dto.publicId,
            dto.platformUserPublicId,
            dto.nickname,
            dto.discriminator,
            dto.avatarUrl,
            dto.presentationIrl ?? null,
            new Date(dto.creationDate),
            dto.characterCount ?? 0,
        );
    }

    public handleLabel(): string {
        return `${this.nickname}#${this.discriminator}`;
    }

    public initials(): string {
        return this.nickname.charAt(0) || "?";
    }
}
