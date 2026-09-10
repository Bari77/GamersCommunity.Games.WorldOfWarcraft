import { GcLink } from "@bari77/gc-widgets";
import { PlayerLinkDto } from "@features/links/dto/player-link.dto";

export class PlayerLink {
    public readonly publicId: string;
    public readonly playerPublicId: string;
    public readonly url: string;
    public readonly label: string;
    public readonly icon: string | null;
    public readonly position: number;

    public constructor(dto: PlayerLinkDto) {
        this.publicId = dto.publicId;
        this.playerPublicId = dto.playerPublicId;
        this.url = dto.url;
        this.label = dto.label;
        this.icon = dto.icon;
        this.position = dto.position;
    }

    public get card(): GcLink {
        return { id: this.publicId, url: this.url, label: this.label, icon: this.icon };
    }

    public static fromDto(dto: PlayerLinkDto): PlayerLink {
        return new PlayerLink(dto);
    }
}
