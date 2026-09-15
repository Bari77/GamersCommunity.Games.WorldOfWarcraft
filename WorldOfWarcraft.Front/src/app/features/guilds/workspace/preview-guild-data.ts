import type { GcGalleryItem, GcLink } from '@bari77/gc-widgets';
import { CharacterDto } from '@features/characters/dto/character.dto';
import { Character } from '@features/characters/models/character.model';
import {
    GUILD_RANK_LEADER,
    GUILD_RANK_MEMBER,
    GUILD_RANK_OFFICER,
    GuildMember,
} from '@features/guilds/models/guild.model';

const GUILD_ID = '00000000-0000-0000-0000-000000000099';
const PLATFORM_USER = '00000000-0000-0000-0000-000000000001';

function character(dto: CharacterDto): Character {
    return Character.fromDto(dto);
}

/** Roster used by the layout editor to size member cards and officer actions. */
export const WORKSPACE_PREVIEW_GUILD_MEMBERS: GuildMember[] = [
    new GuildMember(
        '00000000-0000-0000-0000-000000000301',
        'Aldranor',
        80,
        639,
        'warrior',
        'human',
        'protection',
        'alliance',
        GUILD_RANK_LEADER,
        '00000000-0000-0000-0000-000000000101',
        PLATFORM_USER,
        'PreviewLeader',
        '0001',
        '',
        new Date('2021-06-01T12:00:00Z'),
    ),
    new GuildMember(
        '00000000-0000-0000-0000-000000000302',
        'Lyralei',
        80,
        625,
        'druid',
        'night_elf',
        'restoration',
        'alliance',
        GUILD_RANK_OFFICER,
        '00000000-0000-0000-0000-000000000102',
        PLATFORM_USER,
        'PreviewOfficer',
        '0002',
        '',
        new Date('2022-01-18T09:00:00Z'),
    ),
    new GuildMember(
        '00000000-0000-0000-0000-000000000303',
        'Thalorin',
        80,
        618,
        'paladin',
        'dwarf',
        'retribution',
        'alliance',
        GUILD_RANK_OFFICER,
        '00000000-0000-0000-0000-000000000103',
        PLATFORM_USER,
        'PreviewOfficer2',
        '0003',
        '',
        new Date('2022-09-03T16:30:00Z'),
    ),
    new GuildMember(
        '00000000-0000-0000-0000-000000000304',
        'Kaelis',
        80,
        610,
        'mage',
        'human',
        'fire',
        'alliance',
        GUILD_RANK_MEMBER,
        '00000000-0000-0000-0000-000000000104',
        PLATFORM_USER,
        'PreviewMember',
        '0004',
        '',
        new Date('2023-02-11T20:00:00Z'),
    ),
    new GuildMember(
        '00000000-0000-0000-0000-000000000305',
        'Sylvara',
        80,
        605,
        'hunter',
        'night_elf',
        'beast_mastery',
        'alliance',
        GUILD_RANK_MEMBER,
        '00000000-0000-0000-0000-000000000105',
        PLATFORM_USER,
        'PreviewMember2',
        '0005',
        '',
        new Date('2023-05-22T11:45:00Z'),
    ),
    new GuildMember(
        '00000000-0000-0000-0000-000000000306',
        'Morvek',
        70,
        540,
        'death_knight',
        'human',
        'unholy',
        'alliance',
        GUILD_RANK_MEMBER,
        '00000000-0000-0000-0000-000000000106',
        '00000000-0000-0000-0000-000000000000',
        'Recruit',
        '0006',
        '',
        new Date('2024-12-01T08:00:00Z'),
    ),
];

/** Characters a visitor could pick when applying to the guild. */
export const WORKSPACE_PREVIEW_APPLY_CANDIDATES: Character[] = [
    character({
        publicId: '00000000-0000-0000-0000-000000000401',
        playerPublicId: '00000000-0000-0000-0000-000000000401',
        pseudo: 'Elyndra',
        level: 80,
        ilvl: 612,
        achievement: 15400,
        sentence: null,
        main: true,
        creationDate: '2023-04-02T12:00:00Z',
        idRace: 4,
        raceName: 'gnome',
        idServer: 1,
        serverName: 'hyjal',
        idDirection: 1,
        directionName: 'alliance',
        idClass: 5,
        className: 'rogue',
        idMainSpecializationClass: 5,
        mainSpecializationName: 'assassination',
    }),
    character({
        publicId: '00000000-0000-0000-0000-000000000402',
        playerPublicId: '00000000-0000-0000-0000-000000000401',
        pseudo: 'Elyndra-alt',
        level: 70,
        ilvl: 520,
        achievement: 4200,
        sentence: null,
        main: false,
        creationDate: '2024-08-10T18:00:00Z',
        idRace: 5,
        raceName: 'worgen',
        idServer: 1,
        serverName: 'hyjal',
        idDirection: 1,
        directionName: 'alliance',
        idClass: 6,
        className: 'warlock',
        idMainSpecializationClass: 6,
        mainSpecializationName: 'destruction',
    }),
];

export const WORKSPACE_PREVIEW_GUILD_LINKS: GcLink[] = [
    { url: 'https://discord.gg/example', label: 'Guild Discord' },
    { url: 'https://www.wowprogress.com/', label: 'Progress tracker' },
    { url: 'https://www.youtube.com/@gamerscommunity', label: 'Recruitment video' },
];

export const WORKSPACE_PREVIEW_GUILD_PHOTOS: GcGalleryItem[] = [
    { url: 'https://picsum.photos/seed/gc-guild-photo-1/960/720', title: 'First heroic clear' },
    { url: 'https://picsum.photos/seed/gc-guild-photo-2/960/720', title: 'Guild meeting' },
    { url: 'https://picsum.photos/seed/gc-guild-photo-3/960/720', title: 'Team photo' },
    { url: 'https://picsum.photos/seed/gc-guild-photo-4/960/720', title: 'Raid comp' },
];

export const WORKSPACE_PREVIEW_GUILD_VIDEOS: GcGalleryItem[] = [
    { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', title: 'Recruitment trailer' },
    { url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ', title: 'Boss kill POV' },
];

export interface WorkspacePreviewWallPost {
    author: string;
    date: Date;
    body: string;
    audience?: string;
}

export interface WorkspacePreviewApplication {
    character: string;
    spec: string;
    level: number;
    server: string;
    player: string;
    message: string;
    date: Date;
}

export const WORKSPACE_PREVIEW_PENDING_POSTS: WorkspacePreviewWallPost[] = [
    {
        author: 'Applicant#4242',
        date: new Date('2026-09-11T08:30:00Z'),
        body: 'Selling my mount collection, DM me.',
        audience: 'Members',
    },
];

export const WORKSPACE_PREVIEW_WALL_POSTS: WorkspacePreviewWallPost[] = [
    {
        author: 'PreviewLeader#0001',
        date: new Date('2026-09-10T19:30:00Z'),
        body: 'Raid tonight at 20:30 server time. Bring flasks and two battle res targets ready. We start on the second boss.',
    },
    {
        author: 'PreviewOfficer#0002',
        date: new Date('2026-09-08T14:05:00Z'),
        body: 'Recruitment is open for a ranged DPS and an off-tank. Apply through the widget with your main character and a short message.',
        audience: 'Members',
    },
    {
        author: 'PreviewMember#0004',
        date: new Date('2026-09-05T09:15:00Z'),
        body: 'Great run yesterday, thanks everyone. I posted the logs in Discord for review.',
    },
    {
        author: 'PreviewOfficer2#0003',
        date: new Date('2026-09-03T21:10:00Z'),
        body: 'Keys starting at 21:00. We have a tank, looking for a healer and two DPS. Reply here or ping in Discord.',
    },
];

export const WORKSPACE_PREVIEW_APPLICATIONS: WorkspacePreviewApplication[] = [
    {
        character: 'Elyndra',
        spec: 'Rogue · Assassination',
        level: 80,
        server: 'Hyjal',
        player: 'Applicant#4242',
        message: 'Looking for a CE-oriented guild with two raid nights. I main rogue and can cover an off-night when needed.',
        date: new Date('2026-09-11T16:20:00Z'),
    },
    {
        character: 'Brannik',
        spec: 'Shaman · Restoration',
        level: 80,
        server: 'Hyjal',
        player: 'HealerOne#1337',
        message: 'Returning player, former mythic healer. Happy to trial on normal/heroic first.',
        date: new Date('2026-09-09T11:40:00Z'),
    },
    {
        character: 'Korrath',
        spec: 'Warrior · Protection',
        level: 80,
        server: 'Hyjal',
        player: 'OffTank#0901',
        message: 'Off-tank looking for a stable heroic roster. Available Wednesday and Sunday evenings.',
        date: new Date('2026-09-08T19:05:00Z'),
    },
];

export const WORKSPACE_PREVIEW_GUILD_ID = GUILD_ID;
