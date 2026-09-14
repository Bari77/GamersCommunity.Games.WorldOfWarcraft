import { PlayerSheet } from '@features/players/models/player.model';

/** Mock sheet used by the standalone workspace editor only. */
export const WORKSPACE_PREVIEW_PLAYER = new PlayerSheet(
    '00000000-0000-0000-0000-000000000099',
    '00000000-0000-0000-0000-000000000001',
    'Preview',
    '0001',
    '',
    'Raid leader on Hyjal, mostly evenings and week-end afternoons. IRL I work in IT and I like theorycrafting.',
    'Protection warrior main since Dragonflight. I run keys and heroic raids, looking for a stable roster for mythic progression.',
    42,
    1337,
    new Date('2024-01-15T12:00:00Z'),
    3,
    null,
    null,
);
