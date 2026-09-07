import { createGatewayListHandler, gatewayUrl } from "@bari77/gc-msw";
import { http, HttpResponse } from "msw";
import { environment } from "../environments/environment";
import { mockClasses } from "./data/classes";
import {
    mockGuildSheet,
    mockHomeFeed,
    mockLfgMessages,
    mockPostableGuilds,
    mockRecruitmentMessages,
} from "./data/home-feed";

export const handlers = [
    createGatewayListHandler({
        apiUrl: environment.apiUrl,
        microservice: "worldofwarcraft",
        resource: "Classes",
        data: mockClasses,
    }),
    http.post(gatewayUrl(environment.apiUrl, "worldofwarcraft", "HomeFeed", "actions", "Get"), () =>
        HttpResponse.json(mockHomeFeed),
    ),
    http.post(gatewayUrl(environment.apiUrl, "worldofwarcraft", "LfgAds", "actions", "ListRecent"), async ({ request }) => {
        const { kind } = (await request.json()) as { kind?: string };
        return HttpResponse.json(kind === "recruit" ? mockRecruitmentMessages : mockLfgMessages);
    }),
    http.post(gatewayUrl(environment.apiUrl, "worldofwarcraft", "Guilds", "actions", "ListPostable"), () =>
        HttpResponse.json(mockPostableGuilds),
    ),
    http.get(gatewayUrl(environment.apiUrl, "worldofwarcraft", "Guilds", mockGuildSheet.publicId), () =>
        HttpResponse.json(mockGuildSheet),
    ),
    http.post(gatewayUrl(environment.apiUrl, "worldofwarcraft", "Players", "actions", "Resolve"), () =>
        HttpResponse.json({ playerPublicId: null, hasSheet: false }),
    ),
    http.get(`${environment.apiUrl.replace(/\/+$/, "")}/platform/users/:publicId`, ({ params }) => {
        const publicId = params["publicId"] as string;
        return HttpResponse.json({
            publicId,
            avatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=${publicId}`,
        });
    }),
];
