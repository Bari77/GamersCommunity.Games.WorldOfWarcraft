import { PlayerSheet } from '@features/players/models/player.model';

/** Mock sheet used by the standalone workspace editor only. */
export const WORKSPACE_PREVIEW_PLAYER = new PlayerSheet(
    '00000000-0000-0000-0000-000000000099',
    '00000000-0000-0000-0000-000000000001',
    'Preview',
    '0001',
    '',
    'Sample IRL presentation for the layout editor.',
    'Sample in-game presentation for the layout editor.',
    42,
    1337,
    new Date('2024-01-15T12:00:00Z'),
    3,
    null,
);
