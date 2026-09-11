import type { WidgetCatalog } from '@bari77/gc-widgets';

/**
 * Widget types the WoW sheet can render. `parseWorkspace` drops anything absent
 * from this catalog, so removing an entry retires it from every saved profile.
 */
export const PLAYER_WIDGETS = {
    identity: 'identity',
    presentationIrl: 'presentation-irl',
    presentationIg: 'presentation-ig',
    stats: 'stats',
    characters: 'characters',
    photos: 'photos',
    videos: 'videos',
    streams: 'streams',
    twitch: 'gc-twitch',
    links: 'gc-links',
} as const;

export const gameWorkspaceRegistry = {
    catalog: [
        {
            type: PLAYER_WIDGETS.identity,
            label: $localize`:@@wow.player.widget.identity:Identity`,
            description: $localize`:@@wow.player.widget.identity.desc:Registration date and Platform profile link.`,
            cols: 4,
            rows: 3,
            unique: true,
        },
        {
            type: PLAYER_WIDGETS.presentationIrl,
            label: $localize`:@@wow.player.presentationIrl:IRL presentation`,
            cols: 8,
            rows: 3,
        },
        {
            type: PLAYER_WIDGETS.presentationIg,
            label: $localize`:@@wow.player.presentationIg:In-game presentation`,
            cols: 8,
            rows: 3,
        },
        {
            type: PLAYER_WIDGETS.stats,
            label: $localize`:@@wow.player.widget.stats:Stats`,
            cols: 4,
            rows: 3,
            unique: true,
        },
        {
            type: PLAYER_WIDGETS.characters,
            label: $localize`:@@wow.player.widget.characters:Characters`,
            cols: 12,
            rows: 7,
            unique: true,
        },
        {
            type: PLAYER_WIDGETS.photos,
            label: $localize`:@@wow.player.widget.photos:Photo gallery`,
            cols: 12,
            rows: 6,
        },
        {
            type: PLAYER_WIDGETS.videos,
            label: $localize`:@@wow.player.widget.videos:Video gallery`,
            cols: 12,
            rows: 6,
        },
        {
            type: PLAYER_WIDGETS.streams,
            label: $localize`:@@wow.player.widget.streams:My streams`,
            description: $localize`:@@wow.player.widget.streams.desc:Twitch channels saved on your profile.`,
            cols: 12,
            rows: 6,
        },
        {
            type: PLAYER_WIDGETS.twitch,
            label: $localize`:@@wow.player.widget.twitch:Twitch player`,
            description: $localize`:@@wow.player.widget.twitch.desc:Embeds a single channel of your choice.`,
            cols: 6,
            rows: 5,
            fields: [
                {
                    key: 'channel',
                    type: 'url',
                    label: $localize`:@@wow.player.widget.twitch.channel:Channel or twitch.tv address`,
                    placeholder: 'https://twitch.tv/…',
                },
            ],
        },
        {
            type: PLAYER_WIDGETS.links,
            label: $localize`:@@wow.player.widget.links:Links`,
            description: $localize`:@@wow.player.widget.links.desc:YouTube, X, Instagram, Discord…`,
            cols: 6,
            rows: 3,
        },
    ] satisfies WidgetCatalog,
    columns: 12,
    rowHeight: 90,
};

export const PLAYER_WIDGET_CATALOG = gameWorkspaceRegistry.catalog;
export const PLAYER_WORKSPACE_COLUMNS = gameWorkspaceRegistry.columns;
export const PLAYER_WORKSPACE_ROW_HEIGHT = gameWorkspaceRegistry.rowHeight;
