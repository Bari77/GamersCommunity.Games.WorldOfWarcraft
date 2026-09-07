import { Environment } from "@core/models/environment.model";

export const environment: Environment = {
    production: false,
    apiUrl: "http://localhost:8081/api",
    hubUrl: "http://localhost:8081/hubs/wow-lfg",
    useMocks: false,
};
