import { PlayerGuildDto } from "@features/players/dto/player.dto";
import { GuildCrest } from "@shared/models/guild-crest";

export class PlayerGuild {
    public constructor(
        public publicId: string,
        public entitled: string,
        public discriminator: string,
        public rank: string,
        public crest: GuildCrest,
    ) {}

    public get handle(): string {
        return `${this.entitled}#${this.discriminator}`;
    }

    public static fromDto(dto: PlayerGuildDto): PlayerGuild {
        return new PlayerGuild(dto.publicId, dto.entitled, dto.discriminator, dto.rank, GuildCrest.fromDto(dto.crest));
    }
}
