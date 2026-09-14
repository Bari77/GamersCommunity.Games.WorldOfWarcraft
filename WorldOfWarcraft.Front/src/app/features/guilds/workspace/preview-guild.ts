import { GuildSheet } from '@features/guilds/models/guild.model';
import { GuildCrest } from '@shared/models/guild-crest';

/** Stand-in guild so the layout editor has something to draw without hitting the API. */
export const WORKSPACE_PREVIEW_GUILD = new GuildSheet(
    '00000000-0000-0000-0000-000000000099',
    'Preview',
    '0001',
    12,
    'Sample catchphrase for the layout editor.',
    null,
    'Hyjal',
    'pvpe',
    GuildCrest.fromDto(null),
    new Date('2024-01-15T12:00:00Z'),
    24,
    [],
    'leader',
    null,
    null,
    0,
    0,
);
