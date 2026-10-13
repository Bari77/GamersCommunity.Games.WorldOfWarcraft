namespace WorldOfWarcraft.Consumer.Models;

public sealed class GamePostDto
{
    public Guid PublicId { get; init; }
    public Guid? GuildPublicId { get; init; }
    public string? GuildName { get; init; }
    public string? GuildDiscriminator { get; init; }
    public string Body { get; init; } = "";
    public string? MediaUrl { get; init; }
    public string? MediaKind { get; init; }

    /// <summary>See <see cref="WorldOfWarcraft.Database.Models.GamePostStatusCodes"/>.</summary>
    public string Status { get; init; } = "";

    /// <summary>
    /// Audience of the post: <c>public</c>, or the lowest guild rank allowed to read it.
    /// See <see cref="WorldOfWarcraft.Database.Models.GamePostVisibilityCodes"/>.
    /// </summary>
    public string Visibility { get; init; } = "";

    public DateTime CreationDate { get; init; }

    public Guid AuthorPlayerPublicId { get; init; }
    public Guid AuthorPlatformUserPublicId { get; init; }
    public string AuthorNickname { get; init; } = "";
    public string AuthorDiscriminator { get; init; } = "";
    public string AuthorAvatarUrl { get; init; } = "";

    public string? ModerationReason { get; init; }
    public DateTime? ModeratedAt { get; init; }
}
