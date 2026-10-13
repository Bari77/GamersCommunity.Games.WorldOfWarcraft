/** Only the fields present are saved, so a widget may send a single one of them. */
export interface PlayerUpdateRequestDto {
    presentationIrl?: string | null;
    presentationIg?: string | null;
    nbMount?: number;
    successPoints?: number | null;
    layoutJson?: string | null;
}
