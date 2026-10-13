namespace WorldOfWarcraft.Consumer.Models;

public sealed class GamePostCreateRequest
{
    public Guid GuildPublicId { get; init; }
    public string Body { get; init; } = "";
    public string? MediaUrl { get; init; }
    public string? MediaKind { get; init; }

    /// <summary>Defaults to members only, so nothing leaks outside the guild by accident.</summary>
    public string? Visibility { get; init; }
}
