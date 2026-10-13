namespace WorldOfWarcraft.Consumer.Models;

public sealed class GuildUpdateRequest
{
    public string? Entitled { get; init; }

    public string? Sentence { get; init; }

    /// <summary>Guild progression, which officers keep in step with the game.</summary>
    public int? Level { get; init; }

    /// <summary>See <see cref="WorldOfWarcraft.Database.Models.GuildOrientationCodes"/>.</summary>
    public string? Orientation { get; init; }

    /// <summary>Realm the guild is advertised on, independent of the leader's current character.</summary>
    public int? IdServer { get; init; }

    /// <summary>Crest parts, saved as a whole because the editor composes them together.</summary>
    public GuildCrestUpdate? Crest { get; init; }

    /// <summary>Widget workspace of the page, which only the leader may rearrange.</summary>
    public string? LayoutJson { get; init; }
}
