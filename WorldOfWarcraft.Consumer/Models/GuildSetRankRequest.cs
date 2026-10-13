namespace WorldOfWarcraft.Consumer.Models;

public sealed class GuildSetRankRequest
{
    public Guid GuildPublicId { get; init; }
    public Guid CharacterPublicId { get; init; }

    /// <summary>Either <c>officer</c> or <c>member</c>; leadership moves through TransferLeadership.</summary>
    public string Rank { get; init; } = "";
}
