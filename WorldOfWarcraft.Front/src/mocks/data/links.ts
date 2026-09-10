import { PlayerLinkDto } from "@features/links/dto/player-link.dto";
import { PLAYER_PUBLIC_ID } from "./characters";

const link = (publicId: string, url: string, label: string, icon: string | null, position: number): PlayerLinkDto => ({
    publicId,
    playerPublicId: PLAYER_PUBLIC_ID,
    url,
    label,
    icon,
    position,
});

export const mockPlayerLinks: PlayerLinkDto[] = [
    link("ddddddd1-0000-0000-0000-000000000001", "https://twitch.tv/gamerscommunity", "My Twitch", null, 0),
    link("ddddddd1-0000-0000-0000-000000000002", "https://discord.gg/gamerscommunity", "Guild Discord", null, 1),
    link("ddddddd1-0000-0000-0000-000000000003", "https://bari.dev", "My blog", "link", 2),
];
