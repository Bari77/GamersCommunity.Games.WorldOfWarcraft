export interface CreateLfgMessageRequestDto {
    body: string;
    platformUserId?: number;
    platformUserPublicId?: string;
    guildPublicId?: string;
}
