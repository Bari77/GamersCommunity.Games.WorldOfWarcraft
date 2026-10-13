namespace WorldOfWarcraft.Consumer.Models;

public sealed class LfgAdSummaryDto
{
    public Guid PublicId { get; init; }
    public string Kind { get; init; } = "";
    public string Body { get; init; } = "";
    public DateTime CreationDate { get; init; }
    public DateTime ExpiresAt { get; init; }

    // Author of the ad, present on every kind: drives the player sheet link and moderation.
    public Guid PlayerPublicId { get; init; }
    public Guid PlatformUserPublicId { get; init; }
    public string SenderNickname { get; init; } = "";
    public string SenderDiscriminator { get; init; } = "";
    public string SenderAvatarUrl { get; init; } = "";

    // Set only on recruitment ads, where the guild is the displayed identity.
    public Guid? GuildPublicId { get; init; }
    public string? GuildName { get; init; }
    public string? GuildDiscriminator { get; init; }
    public GuildCrestDto? GuildCrest { get; init; }

    // Snapshot of the author's server and role at posting time; drives the board filters.
    public string? ServerName { get; init; }
    public string? DirectionName { get; init; }
}
