import { PlayerMediaDto } from "@bari77/gc-sdk";
import { MOCK_PERSONAS } from "./portraits";

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
            publicId: `aa000000-0000-4000-8000-${String(personaIndex * 10 + shot).padStart(12, "0")}`,
            playerPublicId,
            url: `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/600`,
            caption: PHOTO_CAPTIONS[(personaIndex * 3 + shot) % PHOTO_CAPTIONS.length],
            share: true,
            creationDate: new Date(Date.UTC(2026, 1 + shot, 3 + personaIndex)).toISOString(),
        };
    });
}

export const mockPlayerPictures: PlayerMediaDto[] = MOCK_PERSONAS.flatMap((persona, index) =>
    picturesFor(persona.playerPublicId!, persona.nickname, index),
);

const aelindraId = MOCK_PERSONAS[0].playerPublicId!;

export const mockPlayerVideos: PlayerMediaDto[] = [
    {
        publicId: "bbbbbbb1-0000-0000-0000-000000000001",
        playerPublicId: aelindraId,
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        caption: "Raid highlights",
        share: true,
        creationDate: new Date("2025-06-01T12:00:00Z").toISOString(),
    },
];

export const mockPlayerStreams: PlayerMediaDto[] = [
    {
        publicId: "ccccccc1-0000-0000-0000-000000000001",
        playerPublicId: aelindraId,
        url: "https://twitch.tv/gamerscommunity",
        caption: "Weekly keys",
        share: true,
        creationDate: new Date("2025-06-01T12:00:00Z").toISOString(),
    },
];
