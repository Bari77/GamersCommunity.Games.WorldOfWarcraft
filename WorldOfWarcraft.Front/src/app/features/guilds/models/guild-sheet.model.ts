import { GuildSheetDto } from "@features/guilds/dto/guild-sheet.dto";
import { GuildCrest } from "@shared/models/guild-crest";
import { GUILD_RANK_LEADER, GUILD_RANK_OFFICER, GuildMember, guildRankWeight } from "./guild.model";

export class GuildSheet {
    public constructor(
        public publicId: string,
        public entitled: string,
        public discriminator: string,
        public level: number,
        public sentence: string | null,
        public layoutJson: string | null,
        public idServer: number,
        public serverName: string,
        public orientationName: string,
        public crest: GuildCrest,
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
            dto.sentence ?? null,
            dto.layoutJson ?? null,
            dto.idServer,
            dto.serverName,
            dto.orientationName,
            GuildCrest.fromDto(dto.crest),
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
