namespace WorldOfWarcraft.Consumer.Models;

/// <summary>
/// Guild badge shown on a player sheet: enough to draw the crest and link to the guild.
/// </summary>
public sealed class PlayerGuildDto
{
    public Guid PublicId { get; init; }
    public string Entitled { get; init; } = "";
    public string Discriminator { get; init; } = "";

    /// <summary>See <see cref="WorldOfWarcraft.Database.Models.GuildRankCodes"/>.</summary>
    public string Rank { get; init; } = "";

    public GuildCrestDto Crest { get; init; } = new();
}
