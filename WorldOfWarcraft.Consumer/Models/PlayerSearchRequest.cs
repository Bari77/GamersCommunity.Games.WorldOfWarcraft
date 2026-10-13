namespace WorldOfWarcraft.Consumer.Models;

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
