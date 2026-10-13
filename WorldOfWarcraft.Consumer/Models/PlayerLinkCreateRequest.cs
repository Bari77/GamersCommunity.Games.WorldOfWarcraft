namespace WorldOfWarcraft.Consumer.Models;

public sealed class PlayerLinkCreateRequest
{
    public string Url { get; init; } = string.Empty;
    public string Label { get; init; } = string.Empty;
    public string? Icon { get; init; }
}
