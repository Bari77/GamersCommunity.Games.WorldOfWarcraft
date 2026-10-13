namespace WorldOfWarcraft.Consumer.Models;

public sealed class GuildLinkCreateRequest
{
    public Guid GuildPublicId { get; init; }
    public string Url { get; init; } = string.Empty;
    public string Label { get; init; } = string.Empty;
    public string? Icon { get; init; }
}
