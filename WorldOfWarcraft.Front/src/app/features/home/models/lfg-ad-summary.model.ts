import { LfgAdSummaryDto } from "@features/home/dto/lfg-ad-summary.dto";

export class LfgAdSummary {
    public constructor(
        public publicId: string,
        public body: string,
        public senderNickname: string,
        public senderDiscriminator: string,
        public creationDate: Date,
        public expiresAt: Date,
        public playerPublicId: string,
        public platformUserPublicId: string,
    ) {}

    public static fromDto(dto: LfgAdSummaryDto): LfgAdSummary {
        return new LfgAdSummary(
            dto.publicId,
            dto.body,
            dto.senderNickname,
            dto.senderDiscriminator,
            new Date(dto.creationDate),
            new Date(dto.expiresAt),
            dto.playerPublicId,
            dto.platformUserPublicId,
        );
    }
}
