import { GuildLinkDto } from "@features/guilds/dto/guild-link.dto";
import { mockUuid } from "./ids";
import { GUILD_PUBLIC_ID } from "./orgs";

const link = (seed: string, url: string, label: string, icon: string | null, position: number): GuildLinkDto => ({
    publicId: mockUuid(`wow:guild-link:${seed}`),
    guildPublicId: GUILD_PUBLIC_ID,
    url,
    label,
    icon,
    position,
});

export const mockGuildLinks: GuildLinkDto[] = [
    link("discord", "https://discord.gg/example", "Discord", "discord", 0),
    link("forum", "https://guardians.example/forum", "Forum", null, 1),
];
