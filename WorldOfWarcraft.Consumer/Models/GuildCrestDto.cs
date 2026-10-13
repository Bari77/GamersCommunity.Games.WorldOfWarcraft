namespace WorldOfWarcraft.Consumer.Models;

/// <summary>
/// Crest of a guild, layered the way the game builds a tabard: a coloured cloth, a border shape
/// and an emblem. <see cref="Faction"/> tells the front end which faction ring to draw around it.
/// </summary>
public sealed class GuildCrestDto
{
    public int Emblem { get; init; }
    public string EmblemColor { get; init; } = "";
    public int Border { get; init; }
    public string BorderColor { get; init; } = "";
    public string BackgroundColor { get; init; } = "";

    /// <summary>Faction of the leader character; null while they have no alignment set.</summary>
    public string? Faction { get; init; }
}
