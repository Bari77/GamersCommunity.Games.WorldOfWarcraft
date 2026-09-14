namespace WorldOfWarcraft.Database.Models;

/// <summary>
/// Neutral tabard worn by a guild until its officers design one. Also the SQL default, so guilds
/// created before the crest existed still render.
/// </summary>
public static class GuildCrestDefaults
{
    public const int Emblem = 0;
    public const int Border = 0;
    public const string EmblemColor = "#f0e6c8";
    public const string BorderColor = "#c8a95a";
    public const string BackgroundColor = "#1e2a4a";
}
