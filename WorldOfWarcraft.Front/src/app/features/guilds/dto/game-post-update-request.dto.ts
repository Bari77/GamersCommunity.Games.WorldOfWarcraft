/** Reserved to the author, and replacing the post wholesale rather than patching it. */
export interface GamePostUpdateRequestDto {
    publicId: string;
    body: string;
    mediaUrl?: string | null;
    mediaKind?: string | null;
    visibility?: string;
}
