export interface GuildLinkDto {
    publicId: string;
    guildPublicId: string;
    url: string;
    label: string;
    icon: string | null;
    position: number;
}

export interface GuildLinkListRequestDto {
    guildPublicId: string;
}

export interface GuildLinkCreateRequestDto {
    guildPublicId: string;
    url: string;
    label: string;
    icon: string | null;
}

export type GuildLinkUpdateRequestDto = Partial<Omit<GuildLinkCreateRequestDto, "guildPublicId">>;

export interface GuildLinkReorderRequestDto {
    guildPublicId: string;
    publicIds: string[];
}
