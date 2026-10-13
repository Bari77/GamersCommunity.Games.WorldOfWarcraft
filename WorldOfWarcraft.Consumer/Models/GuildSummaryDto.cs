namespace WorldOfWarcraft.Consumer.Models;

public sealed class GuildSummaryDto
{
    public Guid PublicId { get; init; }
    public string Entitled { get; init; } = "";
    public string Discriminator { get; init; } = "";
    public int Level { get; init; }
    public DateTime CreationDate { get; init; }
    public string ServerName { get; init; } = "";
    public int MemberCount { get; init; }

    // Filled on the guild directory, where cards need more than a handle to be worth browsing.
    public string? Sentence { get; init; }
    public string? AlignmentName { get; init; }
    public string? OrientationName { get; init; }
    public GuildCrestDto? Crest { get; init; }
}
