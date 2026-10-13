namespace WorldOfWarcraft.Consumer.Models;

public sealed class GuildSearchRequest
{
    /// <summary>Matches the guild name; the discriminator is searchable through <c>Name#1234</c>.</summary>
    public string? Query { get; init; }

    /// <summary>Realm the guild is advertised on, independent of the leader's current character.</summary>
    public int? IdServer { get; init; }

    public int? IdAlignment { get; init; }

    // Cursor, both parts required together: creation date alone is not unique.
    public DateTime? BeforeCreationDate { get; init; }
    public Guid? BeforePublicId { get; init; }

    public int Take { get; init; } = 20;
}
