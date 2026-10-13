import { GuildSheet } from "@features/guilds/models/guild-sheet.model";
import { mockGuildSheet } from "../../../../mocks/catalog/orgs";

export const WORKSPACE_PREVIEW_GUILD = GuildSheet.fromDto(mockGuildSheet);
