namespace WorldOfWarcraft.Consumer.Models;

public sealed class SpecializationClassOptionDto
{
    public int Id { get; init; }
    public string Entitled { get; init; } = "";
    public int IdClass { get; init; }
    public string SpecializationEntitled { get; init; } = "";
}
