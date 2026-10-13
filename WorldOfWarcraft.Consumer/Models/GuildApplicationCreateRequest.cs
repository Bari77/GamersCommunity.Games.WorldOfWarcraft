namespace WorldOfWarcraft.Consumer.Models;

public sealed class GuildApplicationCreateRequest
{
    public Guid GuildPublicId { get; init; }
    public Guid CharacterPublicId { get; init; }
    public string Message { get; init; } = "";
}
