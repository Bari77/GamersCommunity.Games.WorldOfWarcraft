namespace WorldOfWarcraft.Consumer.Models;

public sealed class SearchLfgRequest
{
    /// <summary>See <see cref="WorldOfWarcraft.Database.Models.LfgAdKinds"/>. Defaults to player ads.</summary>
    public string? Kind { get; init; }

    /// <summary>Free text matched against the ad body.</summary>
    public string? Query { get; init; }

    public int? IdServer { get; init; }
    public int? IdDirection { get; init; }

    // Cursor, both parts required together: creation date alone is not unique.
    public DateTime? BeforeCreationDate { get; init; }
    public Guid? BeforePublicId { get; init; }

    public int Take { get; init; } = 20;
}
