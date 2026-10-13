namespace WorldOfWarcraft.Consumer.Models;

public sealed class GuildSearchResultDto
{
    public IReadOnlyList<GuildSummaryDto> Items { get; init; } = [];
    public bool HasMore { get; init; }
}
