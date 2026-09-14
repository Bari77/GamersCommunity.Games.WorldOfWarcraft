import type { GcGalleryItem, GcLink } from '@bari77/gc-widgets';
import { CharacterDto } from '@features/characters/dto/character.dto';
import { Character } from '@features/characters/models/character.model';

const PLAYER_ID = '00000000-0000-0000-0000-000000000099';

function character(dto: CharacterDto): Character {
    return Character.fromDto(dto);
}

/** Sample characters so the layout editor can size the roster widget realistically. */
export const WORKSPACE_PREVIEW_CHARACTERS: Character[] = [
    character({
        publicId: '00000000-0000-0000-0000-000000000101',
        playerPublicId: PLAYER_ID,
        pseudo: 'Aldranor',
        level: 80,
        ilvl: 639,
        achievement: 28450,
        sentence: 'Main tank for heroic progression, available on raid nights.',
        main: true,
        creationDate: '2022-03-12T18:00:00Z',
        idRace: 1,
        raceName: 'human',
        idServer: 1,
        serverName: 'hyjal',
        idDirection: 1,
        directionName: 'alliance',
        idClass: 1,
        className: 'warrior',
        idMainSpecializationClass: 1,
        mainSpecializationName: 'protection',
        guildPublicId: '00000000-0000-0000-0000-000000000201',
        guildName: 'Preview',
        guildDiscriminator: '0001',
        guildRank: 'officer',
    }),
    character({
        publicId: '00000000-0000-0000-0000-000000000102',
        playerPublicId: PLAYER_ID,
        pseudo: 'Lyralei',
        level: 80,
        ilvl: 625,
        achievement: 19200,
        sentence: null,
        main: false,
        creationDate: '2023-08-04T10:30:00Z',
        idRace: 2,
        raceName: 'nightelf',
        idServer: 1,
        serverName: 'hyjal',
        idDirection: 1,
        directionName: 'alliance',
        idClass: 2,
        className: 'druid',
        idMainSpecializationClass: 2,
        mainSpecializationName: 'restoration',
    }),
    character({
        publicId: '00000000-0000-0000-0000-000000000103',
        playerPublicId: PLAYER_ID,
        pseudo: 'Thalorin',
        level: 70,
        ilvl: 580,
        achievement: 8600,
        sentence: 'Alt for Mythic+ and transmog farming.',
        main: false,
        creationDate: '2024-11-20T14:15:00Z',
        idRace: 3,
        raceName: 'dwarf',
        idServer: 1,
        serverName: 'hyjal',
        idDirection: 1,
        directionName: 'alliance',
        idClass: 3,
        className: 'paladin',
        idMainSpecializationClass: 3,
        mainSpecializationName: 'retribution',
    }),
];

export const WORKSPACE_PREVIEW_LINKS: GcLink[] = [
    { url: 'https://www.youtube.com/@gamerscommunity', label: 'YouTube channel' },
    { url: 'https://discord.gg/example', label: 'Discord server' },
    { url: 'https://www.twitch.tv/shroud', label: 'Live streams' },
    { url: 'https://x.com/example', label: 'News on X' },
];

export const WORKSPACE_PREVIEW_PHOTOS: GcGalleryItem[] = [
    { url: 'https://picsum.photos/seed/gc-wow-photo-1/960/720', title: 'Raid night screenshot' },
    { url: 'https://picsum.photos/seed/gc-wow-photo-2/960/720', title: 'Transmog set' },
    { url: 'https://picsum.photos/seed/gc-wow-photo-3/960/720', title: 'Guild event' },
    { url: 'https://picsum.photos/seed/gc-wow-photo-4/960/720', title: 'Dungeon run' },
    { url: 'https://picsum.photos/seed/gc-wow-photo-5/960/720', title: 'Character portrait' },
    { url: 'https://picsum.photos/seed/gc-wow-photo-6/960/720', title: 'Open world' },
];

export const WORKSPACE_PREVIEW_VIDEOS: GcGalleryItem[] = [
    { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', title: 'Mythic boss kill' },
    { url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ', title: 'Raid guide excerpt' },
    { url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', title: 'PvP highlights' },
];

export const WORKSPACE_PREVIEW_STREAMS: GcGalleryItem[] = [
    { url: 'shroud', title: 'Evening raids' },
    { url: 'https://www.twitch.tv/ninja', title: 'Mythic+ keys' },
];
