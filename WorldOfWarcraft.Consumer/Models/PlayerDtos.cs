namespace WorldOfWarcraft.Consumer.Models;

public sealed class PlayerLoadRequest
{
    public int PlatformUserId { get; init; }
    public Guid PlatformUserPublicId { get; init; }
}

/// <summary>Record so a read can hand back a copy with the pages a visitor may not see removed.</summary>
public sealed record PlayerSheetDto
{
    public Guid PublicId { get; init; }
    public Guid PlatformUserPublicId { get; init; }
    public string Nickname { get; init; } = "";
    public string Discriminator { get; init; } = "";
    public string AvatarUrl { get; init; } = "";
    public string? PresentationIrl { get; init; }
    public string? PresentationIg { get; init; }
    public int NbMount { get; init; }
    public int? SuccessPoints { get; init; }
    public DateTime CreationDate { get; init; }
    public int CharacterCount { get; init; }
    public string? LayoutJson { get; init; }

    /// <summary>
    /// Guild of the main character, which the sheet wears as its crest. Null while the player has
    /// no guilded character.
    /// </summary>
    public PlayerGuildDto? Guild { get; init; }
}

/// <summary>
/// Guild badge shown on a player sheet: enough to draw the crest and link to the guild.
/// </summary>
public sealed class PlayerGuildDto
{
    public Guid PublicId { get; init; }
    public string Entitled { get; init; } = "";
    public string Discriminator { get; init; } = "";

    /// <summary>See <see cref="WorldOfWarcraft.Database.Models.GuildRankCodes"/>.</summary>
    public string Rank { get; init; } = "";

    public GuildCrestDto Crest { get; init; } = new();
}

public sealed class PlayerResolveRequest
{
    public Guid PlatformUserPublicId { get; init; }
}

public sealed class PlayerResolveResult
{
    public Guid? PlayerPublicId { get; init; }
    public bool HasSheet => PlayerPublicId.HasValue;
}

/// <summary>
/// Partial update of a sheet: the presence of a field in the payload is what marks it for saving,
/// so a widget can send the single field it edits and an empty value means "erase".
/// </summary>
public sealed class PlayerUpdateRequest
{
    public string? PresentationIrl { get; init; }
    public string? PresentationIg { get; init; }
    public int? NbMount { get; init; }
    public int? SuccessPoints { get; init; }
    public string? LayoutJson { get; init; }
}

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

public sealed class PlayerSearchRequest
{
    /// <summary>
    /// Matches the Platform nickname; the discriminator is searchable through <c>Nickname#1234</c>.
    /// </summary>
    public string? Query { get; init; }

    /// <summary>Keeps only players owning at least one character on that server.</summary>
    public int? IdServer { get; init; }

    // Cursor, both parts required together: creation date alone is not unique.
    public DateTime? BeforeCreationDate { get; init; }
    public Guid? BeforePublicId { get; init; }

    public int Take { get; init; } = 20;
}

public sealed class PlayerSearchResultDto
{
    public IReadOnlyList<PlayerSummaryDto> Items { get; init; } = [];
    public bool HasMore { get; init; }
}
