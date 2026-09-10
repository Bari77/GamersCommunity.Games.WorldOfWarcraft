import { Environment } from "@core/models/environment.model";

export const environment: Environment = {
    production: false,
    apiUrl: "http://localhost:5000/api",
    hubUrl: "http://localhost:5000/hubs/wow-lfg",
    useMocks: true,
    assetsUrl: "http://localhost:4201",
    assetsBaseUrl: "https://host.bariserv.net/GamersCommunity",
};
