namespace WorldOfWarcraft.Consumer.Models;

public sealed class PlayerLinkReorderRequest
{
    public IReadOnlyList<Guid> PublicIds { get; init; } = [];
}
