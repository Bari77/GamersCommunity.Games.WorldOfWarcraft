export interface PlayerSheetDto {
    publicId: string;
    platformUserPublicId: string;
    presentationIrl: string | null;
    presentationIg: string | null;
    nbMount: number;
    successPoints: number | null;
    creationDate: string;
    characterCount: number;
}

export interface PlayerResolveResultDto {
    playerPublicId: string | null;
    hasSheet: boolean;
}

export interface PlayerLoadRequestDto {
    platformUserId: number;
    platformUserPublicId: string;
}

export interface PlayerUpdateRequestDto {
    presentationIrl?: string | null;
    presentationIg?: string | null;
}
