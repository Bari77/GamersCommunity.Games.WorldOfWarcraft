namespace WorldOfWarcraft.Consumer.Models;

public sealed class CharacterSearchResultDto
{
    public IReadOnlyList<CharacterSummaryDto> Items { get; init; } = [];
    public bool HasMore { get; init; }
}
