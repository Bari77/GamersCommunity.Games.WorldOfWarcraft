import { mockPortraitUrl as portraitFromAssets, PlaygroundPersona } from "@bari77/gc-playground";
import { environment } from "../../environments/environment";
import { mockUuid } from "./ids";

/** Same catalog as Platform: `…/Avatars/{1-12}.png`, stable per seed so faces do not flicker. */
export function mockPortraitUrl(seed: string): string {
    return portraitFromAssets(environment.assetsBaseUrl, seed);
}

export interface MockPersona extends PlaygroundPersona {}

/**
 * Synthetic cast for UI-only mocks (not real players).
 * IDs are stable so deep links / LFG / Resolve keep working across reloads.
 */
export const MOCK_PERSONAS: MockPersona[] = [
    {
        id: "Aelindra",
        platformUserPublicId: mockUuid("wow:platform:Aelindra"),
        playerPublicId: mockUuid("wow:player:Aelindra"),
        nickname: "Aelindra",
        discriminator: "0042",
    },
    {
        id: "Thalorim",
        platformUserPublicId: mockUuid("wow:platform:Thalorim"),
        playerPublicId: mockUuid("wow:player:Thalorim"),
        nickname: "Thalorim",
        discriminator: "0108",
    },
    {
        id: "Nerysse",
        platformUserPublicId: mockUuid("wow:platform:Nerysse"),
        playerPublicId: mockUuid("wow:player:Nerysse"),
        nickname: "Nerysse",
        discriminator: "0731",
    },
    {
        id: "Korrath",
        platformUserPublicId: mockUuid("wow:platform:Korrath"),
        playerPublicId: mockUuid("wow:player:Korrath"),
        nickname: "Korrath",
        discriminator: "2214",
    },
    {
        id: "Vaelis",
        platformUserPublicId: mockUuid("wow:platform:Vaelis"),
        playerPublicId: mockUuid("wow:player:Vaelis"),
        nickname: "Vaelis",
        discriminator: "0904",
    },
    {
        id: "Orinthal",
        platformUserPublicId: mockUuid("wow:platform:Orinthal"),
        playerPublicId: mockUuid("wow:player:Orinthal"),
        nickname: "Orinthal",
        discriminator: "1180",
    },
    {
        id: "Maelis",
        platformUserPublicId: mockUuid("wow:platform:Maelis"),
        playerPublicId: mockUuid("wow:player:Maelis"),
        nickname: "Maelis",
        discriminator: "0622",
    },
    {
        id: "Serethis",
        platformUserPublicId: mockUuid("wow:platform:Serethis"),
        playerPublicId: mockUuid("wow:player:Serethis"),
        nickname: "Serethis",
        discriminator: "4419",
    },
    {
        id: "Calyra",
        platformUserPublicId: mockUuid("wow:platform:Calyra"),
        playerPublicId: mockUuid("wow:player:Calyra"),
        nickname: "Calyra",
        discriminator: "0317",
    },
    {
        id: "Dravenor",
        platformUserPublicId: mockUuid("wow:platform:Dravenor"),
        playerPublicId: mockUuid("wow:player:Dravenor"),
        nickname: "Dravenor",
        discriminator: "1503",
    },
    {
        id: "Isendre",
        platformUserPublicId: mockUuid("wow:platform:Isendre"),
        playerPublicId: mockUuid("wow:player:Isendre"),
        nickname: "Isendre",
        discriminator: "2840",
    },
    {
        id: "Torveth",
        platformUserPublicId: mockUuid("wow:platform:Torveth"),
        playerPublicId: mockUuid("wow:player:Torveth"),
        nickname: "Torveth",
        discriminator: "3611",
    },
    {
        id: "Lythara",
        platformUserPublicId: mockUuid("wow:platform:Lythara"),
        playerPublicId: mockUuid("wow:player:Lythara"),
        nickname: "Lythara",
        discriminator: "4722",
    },
    {
        id: "Bramdor",
        platformUserPublicId: mockUuid("wow:platform:Bramdor"),
        playerPublicId: mockUuid("wow:player:Bramdor"),
        nickname: "Bramdor",
        discriminator: "5088",
    },
    {
        id: "Elyndra",
        platformUserPublicId: mockUuid("wow:platform:Elyndra"),
        playerPublicId: mockUuid("wow:player:Elyndra"),
        nickname: "Elyndra",
        discriminator: "6194",
    },
    {
        id: "Quorath",
        platformUserPublicId: mockUuid("wow:platform:Quorath"),
        playerPublicId: mockUuid("wow:player:Quorath"),
        nickname: "Quorath",
        discriminator: "7305",
    },
    {
        id: "Fenrisa",
        platformUserPublicId: mockUuid("wow:platform:Fenrisa"),
        playerPublicId: mockUuid("wow:player:Fenrisa"),
        nickname: "Fenrisa",
        discriminator: "8416",
    },
    {
        id: "Zarokh",
        platformUserPublicId: mockUuid("wow:platform:Zarokh"),
        playerPublicId: mockUuid("wow:player:Zarokh"),
        nickname: "Zarokh",
        discriminator: "9527",
    },
];

/** Older cast so a dedicated search tab has a second page. Dates stay behind the handwritten sheets. */
const SEARCH_FILL_NAMES = [
    "Brialla",
    "Corvyn",
    "Duskara",
    "Elandor",
    "Faelith",
    "Glimric",
    "Harrowen",
    "Iskara",
    "Jorveth",
    "Kelthas",
    "Lirien",
    "Morvane",
    "Nythera",
    "Oswin",
    "Pyrelle",
    "Quenra",
    "Ralvek",
    "Sableth",
    "Thrynn",
    "Ulvara",
    "Veyra",
    "Wylorn",
    "Xerathis",
    "Ysolda",
];

for (const [index, nickname] of SEARCH_FILL_NAMES.entries()) {
    MOCK_PERSONAS.push({
        id: nickname,
        platformUserPublicId: mockUuid(`wow:platform:${nickname}`),
        playerPublicId: mockUuid(`wow:player:${nickname}`),
        nickname,
        discriminator: String(2001 + index).padStart(4, "0"),
    });
}

export const DEFAULT_PERSONA_ID = "Aelindra";

export function persona(nickname: string): MockPersona {
    const found = MOCK_PERSONAS.find((item) => item.id === nickname || item.nickname === nickname);
    if (!found) {
        throw new Error(`Unknown mock persona: ${nickname}`);
    }
    return found;
}

export function personaByPlatformId(publicId: string): MockPersona | undefined {
    return MOCK_PERSONAS.find((item) => item.platformUserPublicId === publicId);
}

export function personaByPlayerId(publicId: string): MockPersona | undefined {
    return MOCK_PERSONAS.find((item) => item.playerPublicId === publicId);
}
