namespace WorldOfWarcraft.Consumer.Models;

public sealed class GuildCrestUpdate
{
    public int Emblem { get; init; }
    public string EmblemColor { get; init; } = "";
    public int Border { get; init; }
    public string BorderColor { get; init; } = "";
    public string BackgroundColor { get; init; } = "";
}
