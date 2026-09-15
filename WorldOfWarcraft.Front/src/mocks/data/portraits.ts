import { environment } from "../../environments/environment";

const AVATAR_MIN_ID = 1;
const AVATAR_MAX_ID = 12;

/** Same catalog as Platform: `…/Avatars/{1-12}.png`, stable per persona so faces do not flicker. */
export function mockPortraitUrl(seed: string): string {
    return `${environment.assetsBaseUrl}/Avatars/${stableAvatarId(seed)}.png`;
}

function stableAvatarId(seed: string): number {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (Math.imul(31, hash) + seed.charCodeAt(i)) | 0;
    }
    const span = AVATAR_MAX_ID - AVATAR_MIN_ID + 1;
    return AVATAR_MIN_ID + (Math.abs(hash) % span);
}

export interface MockPersona {
    platformUserPublicId: string;
    playerPublicId: string | null;
    nickname: string;
    discriminator: string;
}

export const MOCK_PERSONAS: MockPersona[] = [
    {
        platformUserPublicId: "33333333-3333-3333-3333-333333333333",
        playerPublicId: "22222222-2222-2222-2222-222222222222",
        nickname: "Aelindra",
        discriminator: "0042",
    },
    {
        platformUserPublicId: "33333333-3333-3333-3333-33333333333a",
        playerPublicId: "22222222-2222-2222-2222-22222222222a",
        nickname: "Thalorim",
        discriminator: "0108",
    },
    {
        platformUserPublicId: "33333333-3333-3333-3333-33333333333b",
        playerPublicId: "22222222-2222-2222-2222-22222222222b",
        nickname: "Nerysse",
        discriminator: "0731",
    },
    {
        platformUserPublicId: "33333333-3333-3333-3333-33333333333c",
        playerPublicId: "22222222-2222-2222-2222-22222222222c",
        nickname: "Korrath",
        discriminator: "2214",
    },
    {
        platformUserPublicId: "33333333-3333-3333-3333-33333333333d",
        playerPublicId: "22222222-2222-2222-2222-22222222222d",
        nickname: "Vaelis",
        discriminator: "0904",
    },
    {
        platformUserPublicId: "33333333-3333-3333-3333-33333333333e",
        playerPublicId: "22222222-2222-2222-2222-22222222222e",
        nickname: "Orinthal",
        discriminator: "1180",
    },
    {
        platformUserPublicId: "33333333-3333-3333-3333-33333333333f",
        playerPublicId: "22222222-2222-2222-2222-22222222222f",
        nickname: "Maelis",
        discriminator: "0622",
    },
    {
        platformUserPublicId: "33333333-3333-3333-3333-3333333333d0",
        playerPublicId: "22222222-2222-2222-2222-2222222222d0",
        nickname: "Serethis",
        discriminator: "4419",
    },
    {
        platformUserPublicId: "33333333-3333-3333-3333-3333333333d1",
        playerPublicId: "22222222-2222-2222-2222-2222222222d1",
        nickname: "Calyra",
        discriminator: "0317",
    },
];

export function personaByPlatformId(publicId: string): MockPersona | undefined {
    return MOCK_PERSONAS.find((persona) => persona.platformUserPublicId === publicId);
}

export function personaByPlayerId(publicId: string): MockPersona | undefined {
    return MOCK_PERSONAS.find((persona) => persona.playerPublicId === publicId);
}
