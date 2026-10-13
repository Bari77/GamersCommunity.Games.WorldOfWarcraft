namespace WorldOfWarcraft.Consumer.Models;

public sealed class GuildWallRequest
{
    public Guid GuildPublicId { get; init; }

    // Cursor, both parts required together: creation date alone is not unique.
    public DateTime? BeforeCreationDate { get; init; }
    public Guid? BeforePublicId { get; init; }

    public int Take { get; init; } = 20;
}
