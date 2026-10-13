namespace WorldOfWarcraft.Consumer.Models;

public sealed class GuildMemberTargetRequest
{
    public Guid GuildPublicId { get; init; }
    public Guid CharacterPublicId { get; init; }
}
