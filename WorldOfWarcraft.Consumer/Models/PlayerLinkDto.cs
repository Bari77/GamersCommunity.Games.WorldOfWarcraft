namespace WorldOfWarcraft.Consumer.Models;

public sealed class PlayerLinkDto
{
    public Guid PublicId { get; init; }
    public Guid PlayerPublicId { get; init; }
    public string Url { get; init; } = string.Empty;
    public string Label { get; init; } = string.Empty;
    public string? Icon { get; init; }
    public int Position { get; init; }
}
