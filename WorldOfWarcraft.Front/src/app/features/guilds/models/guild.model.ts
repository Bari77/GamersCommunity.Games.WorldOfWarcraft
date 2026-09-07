import { GuildMemberDto, GuildSheetDto } from "@features/guilds/dto/guild.dto";

const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

export class GuildMember {
    public constructor(
        public characterPublicId: string,
        public pseudo: string,
        public level: number,
        public className: string,
        public raceName: string,
        public rank: string,
        public playerPublicId: string,
        public platformUserPublicId: string,
        public nickname: string,
        public discriminator: string,
        public avatarUrl: string,
    ) {}

    public static fromDto(dto: GuildMemberDto): GuildMember {
        return new GuildMember(
            dto.characterPublicId,
            dto.pseudo,
            dto.level,
            dto.className,
            dto.raceName,
            dto.rank,
            dto.playerPublicId,
            dto.platformUserPublicId,
            dto.nickname,
            dto.discriminator,
            dto.avatarUrl,
        );
    }

    public handleLabel(): string {
        return `${this.nickname}#${this.discriminator}`;
    }

    /** Members without a linked Platform account cannot be contacted. */
    public isContactable(): boolean {
        return !!this.platformUserPublicId && this.platformUserPublicId !== EMPTY_GUID;
    }

    public initials(): string {
        return this.pseudo.charAt(0) || "?";
    }
}

export class GuildSheet {
    public constructor(
        public publicId: string,
        public entitled: string,
        public discriminator: string,
        public level: number,
        public sentence: string | null,
        public linkDiscord: string | null,
        public linkForum: string | null,
        public serverName: string,
        public directionName: string,
        public creationDate: Date,
        public members: GuildMember[],
    ) {}

    public static fromDto(dto: GuildSheetDto): GuildSheet {
        return new GuildSheet(
            dto.publicId,
            dto.entitled,
            dto.discriminator,
            dto.level,
            dto.sentence,
            dto.linkDiscord,
            dto.linkForum,
            dto.serverName,
            dto.directionName,
            new Date(dto.creationDate),
            (dto.members ?? []).map((member) => GuildMember.fromDto(member)),
        );
    }

    public handleLabel(): string {
        return `${this.entitled}#${this.discriminator}`;
    }
}
