import { PlayerGuildDto } from "./player.dto";

/**
 * Optional rather than nullable on every field the back may leave empty: its serializer omits null
 * properties, so they reach the client as undefined. Models normalize them.
 */
export interface PlayerSheetDto {
    publicId: string;
    platformUserPublicId: string;
    nickname: string;
    discriminator: string;
    avatarUrl: string;
    presentationIrl?: string | null;
    presentationIg?: string | null;
    nbMount: number;
    successPoints?: number | null;
    creationDate: string;
    characterCount: number;
    layoutJson?: string | null;
    guild?: PlayerGuildDto | null;
}
