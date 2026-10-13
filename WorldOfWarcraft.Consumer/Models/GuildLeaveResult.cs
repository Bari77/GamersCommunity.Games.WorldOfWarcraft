namespace WorldOfWarcraft.Consumer.Models;

public sealed class GuildLeaveResult
{
    public Guid GuildPublicId { get; init; }
    public Guid CharacterPublicId { get; init; }
}
