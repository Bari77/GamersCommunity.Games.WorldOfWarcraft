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
    public int MemberCount { get; init; }
    public IReadOnlyList<GuildMemberDto> Members { get; init; } = [];

    /// <summary>
    /// Best rank the caller holds here, across all their characters. Null for anonymous visitors and
    /// for logged-in players who are not members. See <see cref="WorldOfWarcraft.Database.Models.GuildRankCodes"/>.
    /// </summary>
    public string? ViewerRank { get; init; }

    /// <summary>
    /// Status of the caller's most recent application, so the sheet can show "apply", "pending" or
    /// "rejected" without a second round trip.
    /// </summary>
    public string? ViewerApplicationStatus { get; init; }

    /// <summary>Public id of that application, needed to withdraw it.</summary>
    public Guid? ViewerApplicationPublicId { get; init; }

    /// <summary>Officer counters, left at zero for everyone else.</summary>
    public int PendingApplicationCount { get; init; }

    public int PendingPostCount { get; init; }
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
    public DateTime JoinedAt { get; init; }
}

public sealed class GuildGetRequest
{
    public Guid PublicId { get; init; }
}

public sealed class GuildSearchRequest
{
    /// <summary>Matches the guild name; the discriminator is searchable through <c>Name#1234</c>.</summary>
    public string? Query { get; init; }

    /// <summary>Server and faction are carried by the leader character, as on the guild sheet.</summary>
    public int? IdServer { get; init; }

    public int? IdAlignment { get; init; }

    // Cursor, both parts required together: creation date alone is not unique.
    public DateTime? BeforeCreationDate { get; init; }
    public Guid? BeforePublicId { get; init; }

    public int Take { get; init; } = 20;
}

public sealed class GuildSearchResultDto
{
    public IReadOnlyList<GuildSummaryDto> Items { get; init; } = [];
    public bool HasMore { get; init; }
}

public sealed class GuildCreateRequest
{
    public string Entitled { get; init; } = "";

    /// <summary>Founding character, which becomes the leader. Must not already belong to a guild.</summary>
    public Guid FounderCharacterPublicId { get; init; }

    public string? Sentence { get; init; }
    public string? LinkDiscord { get; init; }
    public string? LinkForum { get; init; }
}

public sealed class GuildUpdateRequest
{
    public string? Sentence { get; init; }
    public string? LinkDiscord { get; init; }
    public string? LinkForum { get; init; }
}

public sealed class GuildMemberTargetRequest
{
    public Guid GuildPublicId { get; init; }
    public Guid CharacterPublicId { get; init; }
}

public sealed class GuildSetRankRequest
{
    public Guid GuildPublicId { get; init; }
    public Guid CharacterPublicId { get; init; }

    /// <summary>Either <c>officer</c> or <c>member</c>; leadership moves through TransferLeadership.</summary>
    public string Rank { get; init; } = "";
}

public sealed class GuildDisbandRequest
{
    public Guid GuildPublicId { get; init; }

    /// <summary>Must equal the guild handle (<c>Entitled#Discriminator</c>) to guard against misclicks.</summary>
    public string Confirmation { get; init; } = "";
}

public sealed class GuildLeaveResult
{
    public Guid GuildPublicId { get; init; }
    public Guid CharacterPublicId { get; init; }
}

public sealed class GuildDisbandResult
{
    public Guid PublicId { get; init; }
    public string Handle { get; init; } = "";
}

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

public sealed class GuildApplicationCreateRequest
{
    public Guid GuildPublicId { get; init; }
    public Guid CharacterPublicId { get; init; }
    public string Message { get; init; } = "";
}

public sealed class GuildApplicationListRequest
{
    public Guid GuildPublicId { get; init; }

    /// <summary>See <see cref="WorldOfWarcraft.Database.Models.GuildApplicationStatusCodes"/>. Defaults to pending.</summary>
    public string? Status { get; init; }
}

public sealed class GuildApplicationReviewRequest
{
    public Guid PublicId { get; init; }
    public bool Accept { get; init; }
}

public sealed class GuildApplicationTargetRequest
{
    public Guid PublicId { get; init; }
}
