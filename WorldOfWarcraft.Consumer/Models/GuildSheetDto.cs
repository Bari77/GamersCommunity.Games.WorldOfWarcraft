namespace WorldOfWarcraft.Consumer.Models;

public sealed class GuildSheetDto
{
    public Guid PublicId { get; init; }
    public string Entitled { get; init; } = "";
    public string Discriminator { get; init; } = "";
    public int Level { get; init; }
    public string? Sentence { get; init; }

    /// <summary>
    /// Widget workspace of the page, arranged by the leader. Null falls back to the layout the
    /// front end ships with.
    /// </summary>
    public string? LayoutJson { get; init; }

    public string ServerName { get; init; } = "";
    public int IdServer { get; init; }

    /// <summary>What the guild plays. See <see cref="WorldOfWarcraft.Database.Models.GuildOrientationCodes"/>.</summary>
    public string OrientationName { get; init; } = "";

    public GuildCrestDto Crest { get; init; } = new();

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
