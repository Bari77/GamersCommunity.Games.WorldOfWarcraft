namespace WorldOfWarcraft.Consumer.Models;

public sealed class GuildDisbandRequest
{
    public Guid GuildPublicId { get; init; }

    /// <summary>Must equal the guild handle (<c>Entitled#Discriminator</c>) to guard against misclicks.</summary>
    public string Confirmation { get; init; } = "";
}
