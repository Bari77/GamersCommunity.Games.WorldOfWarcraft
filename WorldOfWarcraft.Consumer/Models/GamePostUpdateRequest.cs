namespace WorldOfWarcraft.Consumer.Models;

/// <summary>Reserved to the author: officers moderate, they do not rewrite.</summary>
public sealed class GamePostUpdateRequest
{
    public Guid PublicId { get; init; }
    public string Body { get; init; } = "";
    public string? MediaUrl { get; init; }
    public string? MediaKind { get; init; }
    public string? Visibility { get; init; }
}
