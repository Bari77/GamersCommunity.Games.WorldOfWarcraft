namespace WorldOfWarcraft.Consumer.Models;

public sealed class GuildApplicationListRequest
{
    public Guid GuildPublicId { get; init; }

    /// <summary>See <see cref="WorldOfWarcraft.Database.Models.GuildApplicationStatusCodes"/>. Defaults to pending.</summary>
    public string? Status { get; init; }
}
