import { GuildMemberDto, GuildSheetDto, GuildSummaryDto } from "@features/guilds/dto/guild.dto";

const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

export const GUILD_RANK_LEADER = "leader";
export const GUILD_RANK_OFFICER = "officer";
export const GUILD_RANK_MEMBER = "member";

/** Ranks ordered from the most to the least privileged, mirroring the microservice. */
const RANK_WEIGHTS: Record<string, number> = {
    [GUILD_RANK_LEADER]: 3,
    [GUILD_RANK_OFFICER]: 2,
    [GUILD_RANK_MEMBER]: 1,
};

export function guildRankWeight(rank: string | null | undefined): number {
    return rank ? (RANK_WEIGHTS[rank] ?? 0) : 0;
}

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
        public joinedAt: Date,
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
            new Date(dto.joinedAt),
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

    public isLeader(): boolean {
        return this.rank === GUILD_RANK_LEADER;
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
        public memberCount: number,
        public members: GuildMember[],
        public viewerRank: string | null,
        public viewerApplicationStatus: string | null,
        public viewerApplicationPublicId: string | null,
        public pendingApplicationCount: number,
        public pendingPostCount: number,
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
            dto.memberCount ?? (dto.members ?? []).length,
            (dto.members ?? []).map((member) => GuildMember.fromDto(member)),
            dto.viewerRank ?? null,
            dto.viewerApplicationStatus ?? null,
            dto.viewerApplicationPublicId ?? null,
            dto.pendingApplicationCount ?? 0,
            dto.pendingPostCount ?? 0,
        );
    }

    public handleLabel(): string {
        return `${this.entitled}#${this.discriminator}`;
    }

    public isMember(): boolean {
        return guildRankWeight(this.viewerRank) > 0;
    }

    public canModerate(): boolean {
        return guildRankWeight(this.viewerRank) >= guildRankWeight(GUILD_RANK_OFFICER);
    }

    public isLeader(): boolean {
        return this.viewerRank === GUILD_RANK_LEADER;
    }
}

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
        );
    }

    public handleLabel(): string {
        return `${this.entitled}#${this.discriminator}`;
    }
}
