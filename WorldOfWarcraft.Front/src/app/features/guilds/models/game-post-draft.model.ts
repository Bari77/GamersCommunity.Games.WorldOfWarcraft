/** What the publish and edit forms both carry. */
export interface GamePostDraft {
    body: string;
    mediaUrl: string | null;
    visibility: string;
}
