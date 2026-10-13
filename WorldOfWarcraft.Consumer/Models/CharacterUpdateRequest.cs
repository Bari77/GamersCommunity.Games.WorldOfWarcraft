namespace WorldOfWarcraft.Consumer.Models;

public sealed class CharacterUpdateRequest
{
    public string? Pseudo { get; init; }
    public int? Level { get; init; }
    public int? Ilvl { get; init; }
    public int? Achievement { get; init; }
    public string? Sentence { get; init; }
    public bool? Main { get; init; }
    public int? IdRace { get; init; }
    public int? IdServer { get; init; }
    public int? IdDirection { get; init; }
    public int? IdAlignment { get; init; }
    public int? IdMainSpecializationClass { get; init; }
    public int? IdSecondarySpecializationClass { get; init; }
}
