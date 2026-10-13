import { GuildMemberTargetRequestDto } from "./guild-member-target-request.dto";

export interface GuildSetRankRequestDto extends GuildMemberTargetRequestDto {
    rank: string;
}
