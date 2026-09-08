import { WidgetLayout } from "@bari77/gc-widgets";

/**
 * Also acts as the widget catalog: `parseLayout` drops saved widgets missing from
 * this list and appends the ones a player has never seen.
 */
export const PLAYER_DASHBOARD_LAYOUT: WidgetLayout = [
    { id: "identity", x: 0, y: 0, cols: 4, rows: 3 },
    { id: "bio", x: 4, y: 0, cols: 8, rows: 3 },
    { id: "stats", x: 0, y: 3, cols: 4, rows: 2 },
    { id: "characters", x: 0, y: 5, cols: 12, rows: 6 },
];

export const PLAYER_DASHBOARD_COLUMNS = 12;

export const PLAYER_DASHBOARD_ROW_HEIGHT = 90;
