namespace WorldOfWarcraft.Consumer.Models;

public sealed class CharacterOptionsDto
{
    public IReadOnlyList<ReferenceItemDto> Races { get; init; } = [];
    public IReadOnlyList<ReferenceItemDto> Servers { get; init; } = [];
    public IReadOnlyList<ReferenceItemDto> Directions { get; init; } = [];
    public IReadOnlyList<ReferenceItemDto> Alignments { get; init; } = [];
    public IReadOnlyList<ReferenceItemDto> Classes { get; init; } = [];
    public IReadOnlyList<SpecializationClassOptionDto> SpecializationClasses { get; init; } = [];
    public IReadOnlyList<RaceClassOptionDto> RaceClasses { get; init; } = [];
    public int MaxLevel { get; init; }
    public int MaxIlvl { get; init; }
}
