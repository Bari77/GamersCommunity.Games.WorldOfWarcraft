namespace WorldOfWarcraft.Database.Models;

/// <summary>
/// Codes seeded in <see cref="GuildOrientation"/>.
/// </summary>
public static class GuildOrientationCodes
{
    public const string Pve = "pve";
    public const string Pvp = "pvp";
    public const string Pvpe = "pvpe";

    public const string Default = Pve;

    public static readonly string[] All = [Pve, Pvp, Pvpe];
}
