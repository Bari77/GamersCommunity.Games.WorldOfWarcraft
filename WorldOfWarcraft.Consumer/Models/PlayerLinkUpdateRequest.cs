namespace WorldOfWarcraft.Consumer.Models;

public sealed class PlayerLinkUpdateRequest
{
    public string? Url { get; init; }
    public string? Label { get; init; }
    public string? Icon { get; init; }
}
