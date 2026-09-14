import { GUILD_RANK_LEADER, GuildSheet } from '@features/guilds/models/guild.model';
import { GuildCrest } from '@shared/models/guild-crest';
import { WORKSPACE_PREVIEW_GUILD_MEMBERS } from '@features/guilds/workspace/preview-guild-data';

/** Stand-in guild so the layout editor has something to draw without hitting the API. */
export const WORKSPACE_PREVIEW_GUILD = new GuildSheet(
    '00000000-0000-0000-0000-000000000099',
    'Preview',
    '0001',
    12,
    'A friendly CE-oriented guild on Hyjal. Two raid nights, one optional heroic farm, and an active Discord for keys and transmog.',
    null,
    'Hyjal',
    'pvpe',
    GuildCrest.fromDto(null),
    new Date('2024-01-15T12:00:00Z'),
    WORKSPACE_PREVIEW_GUILD_MEMBERS.length,
    WORKSPACE_PREVIEW_GUILD_MEMBERS,
    GUILD_RANK_LEADER,
    null,
    null,
    2,
    1,
);
