import { GC_LINKS_WIDGET, GC_TWITCH_WIDGET, WidgetCatalog, WidgetWorkspace } from "@bari77/gc-widgets";

/**
 * Widget types the WoW sheet can render. `parseWorkspace` drops anything absent
 * from this catalog, so removing an entry retires it from every saved profile.
 */
export const PLAYER_WIDGETS = {
    identity: "identity",
    presentationIrl: "presentation-irl",
    presentationIg: "presentation-ig",
    stats: "stats",
    characters: "characters",
    photos: "photos",
    videos: "videos",
    streams: "streams",
    twitch: GC_TWITCH_WIDGET,
    links: GC_LINKS_WIDGET,
} as const;

export const PLAYER_WIDGET_CATALOG: WidgetCatalog = [
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
                key: "channel",
                type: "url",
                label: $localize`:@@wow.player.widget.twitch.channel:Channel or twitch.tv address`,
                placeholder: "https://twitch.tv/…",
            },
        ],
    },
    {
        // Links live in PlayerLinks, not in the layout, so the widget carries no settings of its
        // own: the sheet hosts both its body and its editor. The gc-links type is kept so saved
        // layouts still resolve.
        type: PLAYER_WIDGETS.links,
        label: $localize`:@@wow.player.widget.links:Links`,
        description: $localize`:@@wow.player.widget.links.desc:YouTube, X, Instagram, Discord…`,
        cols: 6,
        rows: 3,
    },
];

export const PLAYER_WORKSPACE_COLUMNS = 12;

export const PLAYER_WORKSPACE_ROW_HEIGHT = 90;

/** Shown to a player who never customised their sheet, and to every visitor of such a sheet. */
export const PLAYER_DEFAULT_WORKSPACE: WidgetWorkspace = {
    version: 2,
    pages: [
        {
            id: "home",
            title: $localize`:@@wow.player.page.home:Home`,
            locked: true,
            // The hero header already carries the identity, so that widget stays opt-in.
            // Only the two presentations are titled: side by side, nothing else tells the
            // in-game one from the real-life one. The rest speaks for itself bare.
            widgets: [
                { id: "w-stats", type: PLAYER_WIDGETS.stats, x: 0, y: 0, cols: 4, rows: 6, settings: {} },
                {
                    id: "w-irl",
                    type: PLAYER_WIDGETS.presentationIrl,
                    x: 4,
                    y: 0,
                    cols: 8,
                    rows: 3,
                    settings: { title: $localize`:@@wow.player.presentationIrl:IRL presentation` },
                },
                {
                    id: "w-ig",
                    type: PLAYER_WIDGETS.presentationIg,
                    x: 4,
                    y: 3,
                    cols: 8,
                    rows: 3,
                    settings: { title: $localize`:@@wow.player.presentationIg:In-game presentation` },
                },
            ],
        },
        {
            id: "characters",
            title: $localize`:@@wow.player.page.characters:Characters`,
            widgets: [
                { id: "w-characters", type: PLAYER_WIDGETS.characters, x: 0, y: 0, cols: 12, rows: 7, settings: {} },
            ],
        },
        {
            id: "videos",
            title: $localize`:@@wow.player.page.videos:Videos`,
            widgets: [{ id: "w-videos", type: PLAYER_WIDGETS.videos, x: 0, y: 0, cols: 12, rows: 6, settings: {} }],
        },
        {
            id: "photos",
            title: $localize`:@@wow.player.page.photos:Photos`,
            widgets: [{ id: "w-photos", type: PLAYER_WIDGETS.photos, x: 0, y: 0, cols: 12, rows: 6, settings: {} }],
        },
        {
            id: "links",
            title: $localize`:@@wow.player.page.links:Links`,
            widgets: [{ id: "w-links", type: PLAYER_WIDGETS.links, x: 0, y: 0, cols: 6, rows: 3, settings: {} }],
        },
    ],
};
