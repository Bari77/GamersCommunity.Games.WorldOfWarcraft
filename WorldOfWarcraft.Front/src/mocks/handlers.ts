import { createGatewayListHandler, gatewayUrl } from "@bari77/gc-msw";
import { CharacterCreateRequestDto, CharacterDto } from "@features/characters/dto/character.dto";
import { PlayerUpdateRequestDto } from "@features/players/dto/player.dto";
import { http, HttpResponse } from "msw";
import { environment } from "../environments/environment";
import {
    buildMockCharacter,
    mockCharacterOptions,
    mockCharacters,
    mockPlayerSheet,
    PLATFORM_USER_PUBLIC_ID,
} from "./data/characters";
import { mockClasses } from "./data/classes";
import {
    mockGuildSheet,
    mockHomeFeed,
    mockLfgMessages,
    mockPostableGuilds,
    mockRecruitmentMessages,
} from "./data/home-feed";

const charactersUrl = gatewayUrl(environment.apiUrl, "worldofwarcraft", "Characters");
const playersUrl = gatewayUrl(environment.apiUrl, "worldofwarcraft", "Players");

let characters: CharacterDto[] = [...mockCharacters];
let layoutJson: string | null = mockPlayerSheet.layoutJson;

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
    http.post(gatewayUrl(environment.apiUrl, "worldofwarcraft", "LfgAds", "actions", "Create"), async ({ request }) => {
        const body = (await request.json()) as { body: string; guildPublicId?: string };
        const template = body.guildPublicId ? mockRecruitmentMessages[0] : mockLfgMessages[0];
        return HttpResponse.json({
            ...template,
            publicId: crypto.randomUUID(),
            body: body.body,
            creationDate: new Date().toISOString(),
        });
    }),
    http.post(gatewayUrl(environment.apiUrl, "worldofwarcraft", "Guilds", "actions", "ListPostable"), () =>
        HttpResponse.json(mockPostableGuilds),
    ),
    http.get(gatewayUrl(environment.apiUrl, "worldofwarcraft", "Guilds", mockGuildSheet.publicId), () =>
        HttpResponse.json(mockGuildSheet),
    ),
    http.post(gatewayUrl(environment.apiUrl, "worldofwarcraft", "Players", "actions", "Resolve"), () =>
        HttpResponse.json({ playerPublicId: mockPlayerSheet.publicId, hasSheet: true }),
    ),
    http.post(gatewayUrl(environment.apiUrl, "worldofwarcraft", "Players", "actions", "Load"), () =>
        HttpResponse.json(mockPlayerSheet),
    ),
    http.get(gatewayUrl(environment.apiUrl, "worldofwarcraft", "Players", mockPlayerSheet.publicId), () =>
        HttpResponse.json({ ...mockPlayerSheet, characterCount: characters.length, layoutJson }),
    ),
    http.put(`${playersUrl}/:publicId`, async ({ request }) => {
        const body = (await request.json()) as PlayerUpdateRequestDto;
        layoutJson = body.layoutJson ?? layoutJson;
        return HttpResponse.json({ ...mockPlayerSheet, characterCount: characters.length, layoutJson });
    }),
    http.post(gatewayUrl(environment.apiUrl, "worldofwarcraft", "Characters", "actions", "List"), () =>
        HttpResponse.json(characters),
    ),
    http.post(gatewayUrl(environment.apiUrl, "worldofwarcraft", "Characters", "actions", "Options"), () =>
        HttpResponse.json(mockCharacterOptions),
    ),
    http.post(gatewayUrl(environment.apiUrl, "worldofwarcraft", "Characters", "actions", "Create"), async ({ request }) => {
        const body = (await request.json()) as CharacterCreateRequestDto;
        const created = buildMockCharacter(body, crypto.randomUUID());
        characters = created.main ? characters.map((item) => ({ ...item, main: false })) : characters;
        characters = [...characters, created];
        return HttpResponse.json(created);
    }),
    http.put(`${charactersUrl}/:publicId`, async ({ request, params }) => {
        const publicId = params["publicId"] as string;
        const body = (await request.json()) as CharacterCreateRequestDto;
        const updated = { ...buildMockCharacter(body, publicId) };
        characters = characters.map((item) => (item.publicId === publicId ? updated : item));
        if (updated.main) {
            characters = characters.map((item) => (item.publicId === publicId ? item : { ...item, main: false }));
        }
        return HttpResponse.json(updated);
    }),
    http.delete(`${charactersUrl}/:publicId`, ({ params }) => {
        const publicId = params["publicId"] as string;
        characters = characters.filter((item) => item.publicId !== publicId);
        return new HttpResponse(null, { status: 204 });
    }),
    http.post(`${environment.apiUrl.replace(/\/+$/, "")}/platform/users/actions/Touch`, () =>
        HttpResponse.json({
            id: 1,
            publicId: PLATFORM_USER_PUBLIC_ID,
            nickname: "Aelindra",
            discriminator: "0042",
            avatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=${PLATFORM_USER_PUBLIC_ID}`,
            activeMute: null,
        }),
    ),
    http.get(`${environment.apiUrl.replace(/\/+$/, "")}/platform/users/:publicId`, ({ params }) => {
        const publicId = params["publicId"] as string;
        return HttpResponse.json({
            publicId,
            avatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=${publicId}`,
        });
    }),
];
