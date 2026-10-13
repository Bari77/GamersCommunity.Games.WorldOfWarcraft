import { GuildLinkCreateRequestDto } from "./guild-link-create-request.dto";

export interface GuildLinkDto {
    publicId: string;
    guildPublicId: string;
    url: string;
    label: string;
    icon: string | null;
    position: number;
}

export type GuildLinkUpdateRequestDto = Partial<Omit<GuildLinkCreateRequestDto, "guildPublicId">>;
