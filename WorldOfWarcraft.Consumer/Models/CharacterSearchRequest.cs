namespace WorldOfWarcraft.Consumer.Models;

public sealed class CharacterSearchRequest
{
    /// <summary>
    /// Matches the character name. Characters carry no discriminator, so a <c>#</c> in the term is
    /// matched literally rather than split off.
    /// </summary>
    public string? Query { get; init; }

    public int? IdServer { get; init; }
    public int? IdAlignment { get; init; }
    public int? IdDirection { get; init; }

    /// <summary>Class of the main specialization, which is what carries the class on a character.</summary>
    public int? IdClass { get; init; }

    public int? MinLevel { get; init; }

    // Cursor, both parts required together: creation date alone is not unique.
    public DateTime? BeforeCreationDate { get; init; }
    public Guid? BeforePublicId { get; init; }

    public int Take { get; init; } = 20;
}
