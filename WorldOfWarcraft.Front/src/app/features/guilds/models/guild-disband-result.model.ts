import { GuildDisbandResultDto } from "@features/guilds/dto/guild-disband-result.dto";

export class GuildDisbandResult {
    public constructor(
        public publicId: string,
        public handle: string,
    ) {}

    public static fromDto(dto: GuildDisbandResultDto): GuildDisbandResult {
        return new GuildDisbandResult(dto.publicId, dto.handle);
    }
}
