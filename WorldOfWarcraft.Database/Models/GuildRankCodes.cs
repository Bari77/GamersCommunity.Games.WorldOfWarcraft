namespace WorldOfWarcraft.Database.Models;

/// <summary>
/// Codes seeded in <see cref="GuildRank"/>, ordered from the most to the least privileged.
/// </summary>
public static class GuildRankCodes
{
    public const string Leader = "leader";
    public const string Officer = "officer";
    public const string Member = "member";

    /// <summary>
    /// Ranks allowed to publish an announcement on behalf of the guild.
    /// </summary>
    public static readonly string[] CanPostAsGuild = [Leader, Officer];
}
