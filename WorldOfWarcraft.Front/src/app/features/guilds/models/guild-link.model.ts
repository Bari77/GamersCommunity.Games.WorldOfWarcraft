import { GcLink } from "@bari77/gc-widgets";
import { GuildLinkDto } from "@features/guilds/dto/guild-link.dto";

export class GuildLink {
    public readonly publicId: string;
    public readonly guildPublicId: string;
    public readonly url: string;
    public readonly label: string;
    public readonly icon: string | null;
    public readonly position: number;

    public constructor(dto: GuildLinkDto) {
        this.publicId = dto.publicId;
        this.guildPublicId = dto.guildPublicId;
        this.url = dto.url;
        this.label = dto.label;
        this.icon = dto.icon ?? null;
        this.position = dto.position ?? 0;
    }

    public get card(): GcLink {
        return { id: this.publicId, url: this.url, label: this.label, icon: this.icon };
    }

    public static fromDto(dto: GuildLinkDto): GuildLink {
        return new GuildLink(dto);
    }
}
