namespace WorldOfWarcraft.Consumer.Models;

public sealed class GuildSheetDto
{
    public Guid PublicId { get; init; }
    public string Entitled { get; init; } = "";
    public string Discriminator { get; init; } = "";
    public int Level { get; init; }
    public string? Sentence { get; init; }
    public string? LinkDiscord { get; init; }
    public string? LinkForum { get; init; }
    public string ServerName { get; init; } = "";
    public string DirectionName { get; init; } = "";
    public DateTime CreationDate { get; init; }
    public IReadOnlyList<GuildMemberDto> Members { get; init; } = [];
}

/// <summary>
/// A guild member, exposed with the Platform identity of the owning player so visitors can reach
/// out. <see cref="PlatformUserPublicId"/> is empty when the player has no Platform account linked.
/// </summary>
public sealed class GuildMemberDto
{
    public Guid CharacterPublicId { get; init; }
    public string Pseudo { get; init; } = "";
    public int Level { get; init; }
    public string ClassName { get; init; } = "";
    public string RaceName { get; init; } = "";
    public string Rank { get; init; } = "";
    public Guid PlayerPublicId { get; init; }
    public Guid PlatformUserPublicId { get; init; }
    public string Nickname { get; init; } = "";
    public string Discriminator { get; init; } = "";
    public string AvatarUrl { get; init; } = "";
}

public sealed class GuildGetRequest
{
    public Guid PublicId { get; init; }
}
