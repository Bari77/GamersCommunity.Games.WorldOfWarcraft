namespace WorldOfWarcraft.Consumer.Models;

/// <summary>
/// Audiences a player sheet page may be restricted to. The codes are written by the front end into
/// the layout JSON, so they have to match `PLAYER_PAGE_VISIBILITY_OPTIONS` in WorldOfWarcraft.Front.
/// A guild page reuses the guild ranks instead, see <c>GuildRankCodes</c>.
/// </summary>
public static class PageVisibilityCodes
{
    public const string Public = "public";
    public const string Friends = "friends";
    public const string Private = "private";
}
