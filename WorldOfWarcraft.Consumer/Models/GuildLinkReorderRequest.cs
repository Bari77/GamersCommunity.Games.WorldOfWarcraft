namespace WorldOfWarcraft.Consumer.Models;

public sealed class GuildLinkReorderRequest
{
    public Guid GuildPublicId { get; init; }
    public IReadOnlyList<Guid> PublicIds { get; init; } = [];
}
