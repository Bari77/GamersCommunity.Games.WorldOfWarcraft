namespace WorldOfWarcraft.Consumer.Models;

public sealed class CharacterDeleteResult
{
    public Guid PublicId { get; init; }
    public Guid? NewMainPublicId { get; init; }
}
