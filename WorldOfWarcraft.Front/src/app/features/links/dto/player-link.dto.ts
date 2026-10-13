import { PlayerLinkCreateRequestDto } from "./player-link-create-request.dto";

export interface PlayerLinkDto {
    publicId: string;
    playerPublicId: string;
    url: string;
    label: string;
    icon: string | null;
    position: number;
}

export type PlayerLinkUpdateRequestDto = Partial<PlayerLinkCreateRequestDto>;
