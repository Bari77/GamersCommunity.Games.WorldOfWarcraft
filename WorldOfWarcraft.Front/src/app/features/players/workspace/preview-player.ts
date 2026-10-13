import { PlayerSheet } from "@features/players/models/player-sheet.model";
import { mockPlayerSheet } from "../../../../mocks/catalog/characters";

export const WORKSPACE_PREVIEW_PLAYER = PlayerSheet.fromDto(mockPlayerSheet);
