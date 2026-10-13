export interface GamePostCreateRequestDto {
    guildPublicId: string;
    body: string;
    mediaUrl?: string | null;
    mediaKind?: string | null;
    visibility?: string;
}
