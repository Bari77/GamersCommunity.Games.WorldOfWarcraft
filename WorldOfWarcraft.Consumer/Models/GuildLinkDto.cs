namespace WorldOfWarcraft.Consumer.Models;

public sealed class GuildLinkDto
{
    public Guid PublicId { get; init; }
    public Guid GuildPublicId { get; init; }
    public string Url { get; init; } = string.Empty;
    public string Label { get; init; } = string.Empty;
    public string? Icon { get; init; }
    public int Position { get; init; }
}
