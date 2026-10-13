export interface PlayerSearchRequestDto {
    query?: string;
    idServer?: number;
    beforeCreationDate?: string;
    beforePublicId?: string;
    take?: number;
}
