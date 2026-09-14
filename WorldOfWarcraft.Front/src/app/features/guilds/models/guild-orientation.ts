export const GUILD_ORIENTATION_PVE = "pve";
export const GUILD_ORIENTATION_PVP = "pvp";
export const GUILD_ORIENTATION_PVPE = "pvpe";

export interface GuildOrientationOption {
    value: string;
    label: string;
}

/** What the guild plays, as opposed to the role a character fills in a group. */
export const GUILD_ORIENTATION_OPTIONS: readonly GuildOrientationOption[] = [
    { value: GUILD_ORIENTATION_PVE, label: $localize`:@@wow.guild.orientation.pve:PvE` },
    { value: GUILD_ORIENTATION_PVP, label: $localize`:@@wow.guild.orientation.pvp:PvP` },
    { value: GUILD_ORIENTATION_PVPE, label: $localize`:@@wow.guild.orientation.pvpe:PvE and PvP` },
];

export function guildOrientationLabel(orientation: string | null | undefined): string {
    if (!orientation) {
        return "";
    }
    return GUILD_ORIENTATION_OPTIONS.find((option) => option.value === orientation)?.label ?? orientation;
}
