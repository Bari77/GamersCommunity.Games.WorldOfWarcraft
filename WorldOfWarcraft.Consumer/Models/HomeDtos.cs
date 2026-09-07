namespace WorldOfWarcraft.Consumer.Models;

public sealed class HomeFeedDto
{
    public IReadOnlyList<LfgAdSummaryDto> LatestLfg { get; init; } = [];
    public IReadOnlyList<CharacterSummaryDto> LatestCharacters { get; init; } = [];
    public IReadOnlyList<PlayerSummaryDto> LatestPlayers { get; init; } = [];
    public IReadOnlyList<GuildSummaryDto> LatestGuilds { get; init; } = [];
}

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
}

public sealed class CharacterSummaryDto
{
    public Guid PublicId { get; init; }
    public string Pseudo { get; init; } = "";
    public int Level { get; init; }
    public bool Main { get; init; }
    public DateTime CreationDate { get; init; }
    public Guid PlayerPublicId { get; init; }
    public string ServerName { get; init; } = "";
    public string RaceName { get; init; } = "";
}

public sealed class EventSummaryDto
{
    public Guid PublicId { get; init; }
    public string Entitled { get; init; } = "";
    public string Location { get; init; } = "";
    public DateTime DateHourBegin { get; init; }
    public DateTime DateHourEnd { get; init; }
    public string Picture { get; init; } = "";
}

public sealed class GuildSummaryDto
{
    public Guid PublicId { get; init; }
    public string Entitled { get; init; } = "";
    public string Discriminator { get; init; } = "";
    public int Level { get; init; }
    public DateTime CreationDate { get; init; }
    public string ServerName { get; init; } = "";
    public int MemberCount { get; init; }
}

public sealed class ListLfgRecentRequest
{
    /// <summary>See <see cref="WorldOfWarcraft.Database.Models.LfgAdKinds"/>. Defaults to player ads.</summary>
    public string? Kind { get; init; }
}

public sealed class ListLfgBeforeRequest
{
    public string? Kind { get; init; }
    public DateTime BeforeCreationDate { get; init; }
    public Guid BeforePublicId { get; init; }
    public int Take { get; init; } = 50;
}

public sealed class CreateLfgAdRequest
{
    public string Body { get; init; } = "";
    public int PlatformUserId { get; init; }
    public Guid PlatformUserPublicId { get; init; }
    public DateTime? ExpiresAt { get; init; }

    /// <summary>
    /// When set, the ad is published on behalf of that guild. Requires the caller to hold at least
    /// the officer rank there.
    /// </summary>
    public Guid? GuildPublicId { get; init; }
}

public sealed class PostableGuildDto
{
    public Guid PublicId { get; init; }
    public string Entitled { get; init; } = "";
    public string Discriminator { get; init; } = "";
    public string Rank { get; init; } = "";
}
