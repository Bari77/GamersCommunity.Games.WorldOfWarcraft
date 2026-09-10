import { PlayerMediaDto } from "@features/media/dto/player-media.dto";
import { PLAYER_PUBLIC_ID } from "./characters";

const media = (publicId: string, url: string, caption: string | null): PlayerMediaDto => ({
    publicId,
    playerPublicId: PLAYER_PUBLIC_ID,
    url,
    caption,
    share: true,
    creationDate: new Date("2025-06-01T12:00:00Z").toISOString(),
});

export const mockPlayerPictures: PlayerMediaDto[] = [
    media("aaaaaaa1-0000-0000-0000-000000000001", "https://picsum.photos/seed/azeroth1/800/600", "Mythic kill"),
    media("aaaaaaa1-0000-0000-0000-000000000002", "https://picsum.photos/seed/azeroth2/800/600", "Guild night"),
    media("aaaaaaa1-0000-0000-0000-000000000003", "https://picsum.photos/seed/azeroth3/800/600", null),
];

export const mockPlayerVideos: PlayerMediaDto[] = [
    media("bbbbbbb1-0000-0000-0000-000000000001", "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "Raid highlights"),
];

export const mockPlayerStreams: PlayerMediaDto[] = [
    media("ccccccc1-0000-0000-0000-000000000001", "https://twitch.tv/gamerscommunity", "Weekly keys"),
];
