namespace WorldOfWarcraft.Consumer.Models;

public sealed class CreateLfgAdRequest
{
    public string Body { get; init; } = "";
    public int PlatformUserId { get; init; }
    public Guid PlatformUserPublicId { get; init; }
    public DateTime? ExpiresAt { get; init; }

    /// <summary>
    /// When set, the ad is published on behalf of that guild. Requires the caller to hold at least
    /// the officer rank there.
    /// </summary>
    public Guid? GuildPublicId { get; init; }
}
