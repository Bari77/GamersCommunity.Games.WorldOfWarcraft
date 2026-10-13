export interface GuildWallRequestDto {
    guildPublicId: string;
    beforeCreationDate?: string;
    beforePublicId?: string;
    take?: number;
}
