namespace WorldOfWarcraft.Consumer.Models;

public sealed class GuildApplicationReviewRequest
{
    public Guid PublicId { get; init; }
    public bool Accept { get; init; }
}
