import { PlayerSheetDto } from "@features/players/dto/player-sheet.dto";

export interface SheetSeed {
    who: string;
    presentationIrl: string;
    presentationIg: string;
    nbMount: number;
    successPoints: number;
    creationDate: string;
    guild: PlayerSheetDto["guild"];
}
