namespace WorldOfWarcraft.Consumer.Models;

public sealed class GuildApplicationDto
{
    public Guid PublicId { get; init; }
    public string Message { get; init; } = "";
    public string Status { get; init; } = "";
    public DateTime CreationDate { get; init; }
    public DateTime? ReviewedAt { get; init; }

    public Guid GuildPublicId { get; init; }
    public string GuildName { get; init; } = "";
    public string GuildDiscriminator { get; init; } = "";

    public Guid CharacterPublicId { get; init; }
    public string CharacterPseudo { get; init; } = "";
    public int CharacterLevel { get; init; }
    public string CharacterClassName { get; init; } = "";
    public string CharacterRaceName { get; init; } = "";
    public string CharacterServerName { get; init; } = "";

    public Guid PlayerPublicId { get; init; }
    public Guid PlatformUserPublicId { get; init; }
    public string Nickname { get; init; } = "";
    public string Discriminator { get; init; } = "";
    public string AvatarUrl { get; init; } = "";
}
