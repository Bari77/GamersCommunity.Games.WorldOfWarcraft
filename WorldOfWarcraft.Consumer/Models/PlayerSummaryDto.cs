namespace WorldOfWarcraft.Consumer.Models;

public sealed class PlayerSummaryDto
{
    public Guid PublicId { get; init; }
    public Guid PlatformUserPublicId { get; init; }
    public string Nickname { get; init; } = "";
    public string Discriminator { get; init; } = "";
    public string AvatarUrl { get; init; } = "";
    public string? PresentationIrl { get; init; }
    public DateTime CreationDate { get; init; }

    /// <summary>Characters owned on this game, so a search result is worth clicking.</summary>
    public int CharacterCount { get; init; }
}
