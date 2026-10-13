namespace WorldOfWarcraft.Consumer.Models;

public sealed class HomeFeedDto
{
    public IReadOnlyList<LfgAdSummaryDto> LatestLfg { get; init; } = [];
    public IReadOnlyList<CharacterSummaryDto> LatestCharacters { get; init; } = [];
    public IReadOnlyList<PlayerSummaryDto> LatestPlayers { get; init; } = [];
    public IReadOnlyList<GuildSummaryDto> LatestGuilds { get; init; } = [];
}
