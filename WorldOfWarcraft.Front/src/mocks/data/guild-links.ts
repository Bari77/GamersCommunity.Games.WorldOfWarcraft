import { GuildLinkDto } from "@features/guilds/dto/guild-link.dto";
import { GUILD_PUBLIC_ID } from "./guilds";

const link = (publicId: string, url: string, label: string, icon: string | null, position: number): GuildLinkDto => ({
    publicId,
    guildPublicId: GUILD_PUBLIC_ID,
    url,
    label,
    icon,
    position,
});

export const mockGuildLinks: GuildLinkDto[] = [
    link("dddddd10-0000-0000-0000-000000000001", "https://discord.gg/example", "Discord", "discord", 0),
    link("dddddd10-0000-0000-0000-000000000002", "https://guardians.example/forum", "Forum", null, 1),
];
