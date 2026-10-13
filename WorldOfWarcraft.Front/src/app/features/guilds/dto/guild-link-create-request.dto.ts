export interface GuildLinkCreateRequestDto {
    guildPublicId: string;
    url: string;
    label: string;
    icon: string | null;
}
