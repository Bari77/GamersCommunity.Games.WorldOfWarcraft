import { GuildLeaveResultDto } from "@features/guilds/dto/guild-leave-result.dto";

export class GuildLeaveResult {
    public constructor(
        public guildPublicId: string,
        public characterPublicId: string,
    ) {}

    public static fromDto(dto: GuildLeaveResultDto): GuildLeaveResult {
        return new GuildLeaveResult(dto.guildPublicId, dto.characterPublicId);
    }
}
