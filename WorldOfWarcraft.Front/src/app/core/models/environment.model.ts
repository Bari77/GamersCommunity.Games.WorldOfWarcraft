export interface Environment {
    production: boolean;
    apiUrl: string;
    hubUrl?: string;
    useMocks: boolean;
    /** Origin serving this remote's `public/` folder: the shell cannot serve our assets. */
    assetsUrl: string;
    /** Shared GamersCommunity asset host, where Platform stores avatars and game icons. */
    assetsBaseUrl: string;
}
