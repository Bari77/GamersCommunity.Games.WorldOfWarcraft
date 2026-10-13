import { GuildSummaryDto } from "@features/guilds/dto/guild-summary.dto";
import { GuildCrest } from "@shared/models/guild-crest";

export class GuildSummary {
    public constructor(
        public publicId: string,
        public entitled: string,
        public discriminator: string,
        public level: number,
        public creationDate: Date,
        public serverName: string,
        public memberCount: number,
        public sentence: string | null,
        public alignmentName: string | null,
        public orientationName: string | null,
        public crest: GuildCrest,
    ) {}

    public static fromDto(dto: GuildSummaryDto): GuildSummary {
        return new GuildSummary(
            dto.publicId,
            dto.entitled,
            dto.discriminator,
            dto.level,
            new Date(dto.creationDate),
            dto.serverName,
            dto.memberCount,
            dto.sentence ?? null,
            dto.alignmentName ?? null,
            dto.orientationName ?? null,
            GuildCrest.fromDto(dto.crest),
        );
    }

    public handleLabel(): string {
        return `${this.entitled}#${this.discriminator}`;
    }
}
