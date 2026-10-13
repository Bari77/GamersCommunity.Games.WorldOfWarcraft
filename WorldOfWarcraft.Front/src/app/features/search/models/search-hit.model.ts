/** A result the page can jump to directly. Characters have no sheet of their own. */
export interface SearchHit {
    kind: "guild" | "player";
    publicId: string;
}
