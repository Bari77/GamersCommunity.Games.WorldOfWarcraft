import { GuildApplicationDto } from "@features/guilds/dto/guild-application.dto";

const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

export const APPLICATION_PENDING = "pending";
export const APPLICATION_ACCEPTED = "accepted";
export const APPLICATION_REJECTED = "rejected";
export const APPLICATION_WITHDRAWN = "withdrawn";

export class GuildApplication {
    public constructor(
        public publicId: string,
        public message: string,
        public status: string,
        public creationDate: Date,
        public reviewedAt: Date | null,
        public guildPublicId: string,
        public guildName: string,
        public guildDiscriminator: string,
        public characterPublicId: string,
        public characterPseudo: string,
        public characterLevel: number,
        public characterClassName: string,
        public characterRaceName: string,
        public characterServerName: string,
        public playerPublicId: string,
        public platformUserPublicId: string,
        public nickname: string,
        public discriminator: string,
        public avatarUrl: string,
    ) {}

    public static fromDto(dto: GuildApplicationDto): GuildApplication {
        return new GuildApplication(
            dto.publicId,
            dto.message,
            dto.status,
            new Date(dto.creationDate),
            dto.reviewedAt ? new Date(dto.reviewedAt) : null,
            dto.guildPublicId,
            dto.guildName,
            dto.guildDiscriminator,
            dto.characterPublicId,
            dto.characterPseudo,
            dto.characterLevel,
            dto.characterClassName,
            dto.characterRaceName,
            dto.characterServerName,
            dto.playerPublicId,
            dto.platformUserPublicId,
            dto.nickname,
            dto.discriminator,
            dto.avatarUrl,
        );
    }

    public guildHandleLabel(): string {
        return `${this.guildName}#${this.guildDiscriminator}`;
    }

    public playerHandleLabel(): string {
        return `${this.nickname}#${this.discriminator}`;
    }

    public isPending(): boolean {
        return this.status === APPLICATION_PENDING;
    }

    public isContactable(): boolean {
        return !!this.platformUserPublicId && this.platformUserPublicId !== EMPTY_GUID;
    }

    public initials(): string {
        return this.characterPseudo.charAt(0) || "?";
    }
}
