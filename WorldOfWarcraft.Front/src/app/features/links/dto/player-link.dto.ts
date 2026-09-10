export interface PlayerLinkDto {
    publicId: string;
    playerPublicId: string;
    url: string;
    label: string;
    icon: string | null;
    position: number;
}

export interface PlayerLinkListRequestDto {
    playerPublicId: string;
}

export interface PlayerLinkCreateRequestDto {
    url: string;
    label: string;
    icon: string | null;
}

export type PlayerLinkUpdateRequestDto = Partial<PlayerLinkCreateRequestDto>;

export interface PlayerLinkReorderRequestDto {
    publicIds: string[];
}
