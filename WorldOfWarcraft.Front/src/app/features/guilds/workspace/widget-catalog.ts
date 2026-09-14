import type { WidgetCatalog, WidgetPageVisibilityOption } from '@bari77/gc-widgets';
import { GUILD_RANK_LEADER, GUILD_RANK_MEMBER, GUILD_RANK_OFFICER } from '@features/guilds/models/guild.model';
import { POST_VISIBILITY_PUBLIC } from '@features/guilds/models/game-post.model';

/** Audiences a guild page may be restricted to, reusing the ranks the wall already speaks. */
export const GUILD_PAGE_VISIBILITY_OPTIONS: WidgetPageVisibilityOption[] = [
    { value: POST_VISIBILITY_PUBLIC, label: $localize`:@@wow.guild.wall.visibility.public:Public` },
    { value: GUILD_RANK_MEMBER, label: $localize`:@@wow.guild.wall.visibility.member:Members` },
    { value: GUILD_RANK_OFFICER, label: $localize`:@@wow.guild.wall.visibility.officer:Officers` },
    { value: GUILD_RANK_LEADER, label: $localize`:@@wow.guild.wall.visibility.leader:Leader only` },
];

/**
 * Widget types a guild page can render. `parseWorkspace` drops anything absent from this catalog,
 * so removing an entry retires it from every saved guild layout.
 */
export const GUILD_WIDGETS = {
    presentation: 'guild-presentation',
    stats: 'guild-stats',
    roster: 'guild-roster',
    wall: 'guild-wall',
    applications: 'guild-applications',
    recruitment: 'guild-recruitment',
    photos: 'guild-photos',
    videos: 'guild-videos',
    twitch: 'gc-twitch',
    links: 'gc-links',
} as const;

export const gameWorkspaceRegistry = {
    catalog: [
        {
            type: GUILD_WIDGETS.presentation,
            label: $localize`:@@wow.guild.widget.presentation:Presentation`,
            description: $localize`:@@wow.guild.widget.presentation.desc:The catchphrase officers write in the settings.`,
            cols: 8,
            rows: 3,
        },
        {
            type: GUILD_WIDGETS.stats,
            label: $localize`:@@wow.guild.widget.stats:Stats`,
            description: $localize`:@@wow.guild.widget.stats.desc:Level, roster size and founding date.`,
            cols: 4,
            rows: 3,
            unique: true,
        },
        {
            type: GUILD_WIDGETS.roster,
            label: $localize`:@@wow.guild.widget.roster:Roster`,
            cols: 12,
            rows: 7,
            unique: true,
        },
        {
            type: GUILD_WIDGETS.wall,
            label: $localize`:@@wow.guild.widget.wall:Guild wall`,
            cols: 12,
            rows: 8,
            unique: true,
        },
        {
            type: GUILD_WIDGETS.applications,
            label: $localize`:@@wow.guild.widget.applications:Applications`,
            description: $localize`:@@wow.guild.widget.applications.desc:Only officers ever see this one.`,
            cols: 6,
            rows: 6,
            unique: true,
        },
        {
            type: GUILD_WIDGETS.recruitment,
            label: $localize`:@@wow.guild.widget.recruitment:Recruitment`,
            description: $localize`:@@wow.guild.widget.recruitment.desc:Lets a visitor apply with one of their characters.`,
            cols: 6,
            rows: 6,
            unique: true,
        },
        {
            type: GUILD_WIDGETS.photos,
            label: $localize`:@@wow.guild.widget.photos:Photo gallery`,
            cols: 12,
            rows: 6,
            fields: [
                {
                    key: 'items',
                    type: 'list',
                    label: $localize`:@@wow.guild.widget.photos.items:Images`,
                    addLabel: $localize`:@@wow.guild.widget.media.add:Add a media`,
                    itemFields: [
                        {
                            key: 'url',
                            type: 'url',
                            label: $localize`:@@wow.guild.widget.media.url:Address`,
                            placeholder: 'https://…',
                        },
                        {
                            key: 'title',
                            type: 'text',
                            label: $localize`:@@wow.guild.widget.media.title:Caption`,
                        },
                    ],
                },
            ],
        },
        {
            type: GUILD_WIDGETS.videos,
            label: $localize`:@@wow.guild.widget.videos:Video gallery`,
            description: $localize`:@@wow.guild.widget.videos.desc:YouTube, Vimeo, Twitch clips and VODs.`,
            cols: 12,
            rows: 6,
            fields: [
                {
                    key: 'items',
                    type: 'list',
                    label: $localize`:@@wow.guild.widget.videos.items:Videos`,
                    addLabel: $localize`:@@wow.guild.widget.media.add:Add a media`,
                    itemFields: [
                        {
                            key: 'url',
                            type: 'url',
                            label: $localize`:@@wow.guild.widget.media.url:Address`,
                            placeholder: 'https://…',
                        },
                        {
                            key: 'title',
                            type: 'text',
                            label: $localize`:@@wow.guild.widget.media.title:Caption`,
                        },
                    ],
                },
            ],
        },
        {
            type: GUILD_WIDGETS.twitch,
            label: $localize`:@@wow.guild.widget.twitch:Twitch player`,
            description: $localize`:@@wow.guild.widget.twitch.desc:Embeds the channel the guild streams on.`,
            cols: 6,
            rows: 5,
            fields: [
                {
                    key: 'channel',
                    type: 'url',
                    label: $localize`:@@wow.guild.widget.twitch.channel:Channel or twitch.tv address`,
                    placeholder: 'https://twitch.tv/…',
                },
            ],
        },
        {
            type: GUILD_WIDGETS.links,
            label: $localize`:@@wow.guild.widget.links:Links`,
            description: $localize`:@@wow.guild.widget.links.desc:Discord, forum, social networks…`,
            cols: 6,
            rows: 4,
        },
    ] satisfies WidgetCatalog,
    columns: 12,
    rowHeight: 90,
    pageVisibilityOptions: GUILD_PAGE_VISIBILITY_OPTIONS,
};

export const GUILD_WIDGET_CATALOG = gameWorkspaceRegistry.catalog;
export const GUILD_WORKSPACE_COLUMNS = gameWorkspaceRegistry.columns;
export const GUILD_WORKSPACE_ROW_HEIGHT = gameWorkspaceRegistry.rowHeight;
