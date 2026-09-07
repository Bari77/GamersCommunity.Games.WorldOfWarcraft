namespace WorldOfWarcraft.Database.Models;

/// <summary>
/// Values stored in <see cref="LfgAd.Kind"/>, telling on whose behalf an ad was published.
/// </summary>
public static class LfgAdKinds
{
    /// <summary>A player looking for a group. <see cref="LfgAd.IdGuild"/> is null.</summary>
    public const string LookingForGroup = "lfg";

    /// <summary>A guild recruiting. <see cref="LfgAd.IdGuild"/> identifies the guild.</summary>
    public const string Recruitment = "recruit";

    public static bool IsKnown(string kind) => kind is LookingForGroup or Recruitment;
}
