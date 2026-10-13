namespace WorldOfWarcraft.Consumer.Models;

public sealed class GuildCreateRequest
{
    public string Entitled { get; init; } = "";

    /// <summary>Founding character, which becomes the leader. Must not already belong to a guild.</summary>
    public Guid FounderCharacterPublicId { get; init; }

    public string? Sentence { get; init; }

    /// <summary>See <see cref="WorldOfWarcraft.Database.Models.GuildOrientationCodes"/>. Defaults to pve.</summary>
    public string? Orientation { get; init; }
}
