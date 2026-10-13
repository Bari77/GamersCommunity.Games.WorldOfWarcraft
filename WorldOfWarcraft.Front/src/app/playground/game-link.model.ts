export interface GameLink {
    path: string;
    label: string;
    queryParams?: Record<string, string>;
    /** Path prefix that also lights this link, such as a guild sheet under Guilds. */
    activePrefix?: string;
}
