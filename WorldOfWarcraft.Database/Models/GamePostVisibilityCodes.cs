namespace WorldOfWarcraft.Database.Models;

/// <summary>
/// Reading audience of a wall post, as carried by the API. Every value but <see cref="Public"/> is
/// a <see cref="GuildRankCodes"/> entry, stored as the post's minimum rank.
/// </summary>
public static class GamePostVisibilityCodes
{
    public const string Public = "public";

    /// <summary>Audience a post falls back to, so nothing leaks outside the guild by accident.</summary>
    public const string Default = GuildRankCodes.Member;

    public static readonly string[] All = [Public, GuildRankCodes.Member, GuildRankCodes.Officer, GuildRankCodes.Leader];
}
