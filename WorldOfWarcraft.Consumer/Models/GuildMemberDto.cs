namespace WorldOfWarcraft.Consumer.Models;

/// <summary>
/// A guild member, exposed with the Platform identity of the owning player so visitors can reach
/// out. <see cref="PlatformUserPublicId"/> is empty when the player has no Platform account linked.
/// </summary>
public sealed class GuildMemberDto
{
    public Guid CharacterPublicId { get; init; }
    public string Pseudo { get; init; } = "";
    public int Level { get; init; }
    public int Ilvl { get; init; }
    public string ClassName { get; init; } = "";
    public string? MainSpecializationName { get; init; }
    public string RaceName { get; init; } = "";

    /// <summary>Role the character signed up for. See <see cref="WorldOfWarcraft.Database.Models.Direction"/>.</summary>
    public string DirectionName { get; init; } = "";

    public string Rank { get; init; } = "";
    public Guid PlayerPublicId { get; init; }
    public Guid PlatformUserPublicId { get; init; }
    public string Nickname { get; init; } = "";
    public string Discriminator { get; init; } = "";
    public string AvatarUrl { get; init; } = "";
    public DateTime JoinedAt { get; init; }
}
