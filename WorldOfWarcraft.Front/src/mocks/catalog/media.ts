import { PlayerMediaDto } from "@bari77/gc-sdk";
import { mockUuid } from "./ids";
import { MOCK_PERSONAS, persona } from "./personas";

const PHOTO_CAPTIONS = [
    "Mythic kill",
    "Guild night",
    "Key push",
    "Transmog run",
    null,
    "Raid ready",
    "World tour",
    "Screenshot dump",
];

function picturesFor(playerPublicId: string, nickname: string, personaIndex: number): PlayerMediaDto[] {
    const count = 3 + (personaIndex % 3);
    return Array.from({ length: count }, (_, shot) => {
        const seed = `${nickname.toLowerCase()}-shot-${shot + 1}`;
        return {
            publicId: mockUuid(`wow:picture:${nickname}:${shot}`),
            playerPublicId,
            url: `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/600`,
            caption: PHOTO_CAPTIONS[(personaIndex * 3 + shot) % PHOTO_CAPTIONS.length],
            share: true,
            creationDate: new Date(Date.UTC(2026, 1 + shot, 3 + personaIndex)).toISOString(),
        };
    });
}

/** Picsum seeds for every playground persona (count varies by index). */
export const mockPlayerPictures: PlayerMediaDto[] = MOCK_PERSONAS.flatMap((who, index) =>
    picturesFor(who.playerPublicId, who.nickname, index),
);

function video(nickname: string, caption: string, creationDate: string): PlayerMediaDto {
    const who = persona(nickname);
    return {
        publicId: mockUuid(`wow:video:${nickname}`),
        playerPublicId: who.playerPublicId,
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        caption,
        share: true,
        creationDate: new Date(creationDate).toISOString(),
    };
}

export const mockPlayerVideos: PlayerMediaDto[] = [
    video("Aelindra", "Raid highlights", "2025-06-01T12:00:00Z"),
    video("Thalorim", "Tank POV — heroic bosses", "2025-08-14T18:00:00Z"),
    video("Korrath", "Rated BG chaos reel", "2025-09-02T21:00:00Z"),
    video("Dravenor", "Stormwatch pull timers", "2025-11-20T19:30:00Z"),
    video("Lythara", "Emberhold destro parses", "2026-01-08T16:45:00Z"),
    video("Zarokh", "Subtlety opener practice", "2026-02-22T11:10:00Z"),
    video("Elyndra", "Arcane burst showcase", "2026-03-15T14:00:00Z"),
];

export const mockPlayerStreams: PlayerMediaDto[] = [
    {
        publicId: mockUuid("wow:stream:Aelindra"),
        playerPublicId: persona("Aelindra").playerPublicId,
        url: "https://twitch.tv/gamerscommunity",
        caption: "Weekly keys",
        share: true,
        creationDate: new Date("2025-06-01T12:00:00Z").toISOString(),
    },
    {
        publicId: mockUuid("wow:stream:Vaelis"),
        playerPublicId: persona("Vaelis").playerPublicId,
        url: "https://twitch.tv/gamerscommunity",
        caption: "Social night on Elune",
        share: true,
        creationDate: new Date("2025-10-11T20:00:00Z").toISOString(),
    },
    {
        publicId: mockUuid("wow:stream:Bramdor"),
        playerPublicId: persona("Bramdor").playerPublicId,
        url: "https://twitch.tv/gamerscommunity",
        caption: "Emberhold tank practice",
        share: true,
        creationDate: new Date("2026-01-19T19:00:00Z").toISOString(),
    },
];
