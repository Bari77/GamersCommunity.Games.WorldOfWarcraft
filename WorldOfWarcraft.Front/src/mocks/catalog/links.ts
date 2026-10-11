import { PlayerLinkDto } from "@features/links/dto/player-link.dto";
import { PLAYER_PUBLIC_ID } from "./characters";
import { mockUuid } from "./ids";

const link = (seed: string, url: string, label: string, icon: string | null, position: number): PlayerLinkDto => ({
    publicId: mockUuid(`wow:player-link:${seed}`),
    playerPublicId: PLAYER_PUBLIC_ID,
    url,
    label,
    icon,
    position,
});

export const mockPlayerLinks: PlayerLinkDto[] = [
    link("twitch", "https://twitch.tv/gamerscommunity", "My Twitch", null, 0),
    link("discord", "https://discord.gg/gamerscommunity", "Guild Discord", null, 1),
    link("blog", "https://bari.dev", "My blog", "link", 2),
];
