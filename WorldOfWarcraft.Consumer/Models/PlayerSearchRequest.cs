namespace WorldOfWarcraft.Consumer.Models;

public sealed class PlayerSearchRequest
{
    /// <summary>
    /// Matches the Platform nickname; the discriminator is searchable through <c>Nickname#1234</c>.
    /// </summary>
    public string? Query { get; init; }

    /// <summary>Keeps only players owning at least one character on that server.</summary>
    public int? IdServer { get; init; }

    public int? IdAlignment { get; init; }

    public int? IdClass { get; init; }

    public int? IdRace { get; init; }

    public int? IdDirection { get; init; }

    public int? IdSpecializationClass { get; init; }

    public int? MinLevel { get; init; }

    public int? MinIlvl { get; init; }

    /// <summary>
    /// True keeps players who already have a character in a guild. False keeps players whose
    /// characters are all still guildless.
    /// </summary>
    public bool? InGuild { get; init; }

    // Cursor, both parts required together: creation date alone is not unique.
    public DateTime? BeforeCreationDate { get; init; }
    public Guid? BeforePublicId { get; init; }

    public int Take { get; init; } = 20;
}
