import { PostableGuildDto } from "@features/lfg/dto/postable-guild.dto";

export class PostableGuild {
    public constructor(
        public publicId: string,
        public entitled: string,
        public discriminator: string,
        public rank: string,
    ) {}

    public static fromDto(dto: PostableGuildDto): PostableGuild {
        return new PostableGuild(dto.publicId, dto.entitled, dto.discriminator, dto.rank);
    }

    public handleLabel(): string {
        return `${this.entitled}#${this.discriminator}`;
    }
}
