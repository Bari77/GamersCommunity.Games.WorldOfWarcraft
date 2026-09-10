namespace WorldOfWarcraft.Consumer.Models;

public sealed class CharacterDto
{
    public Guid PublicId { get; init; }
    public Guid PlayerPublicId { get; init; }
    public string Pseudo { get; init; } = "";
    public int Level { get; init; }
    public int Ilvl { get; init; }
    public int Achievement { get; init; }
    public string? Sentence { get; init; }
    public bool Main { get; init; }
    public DateTime CreationDate { get; init; }

    public int IdRace { get; init; }
    public string RaceName { get; init; } = "";

    public int IdServer { get; init; }
    public string ServerName { get; init; } = "";

    public int IdDirection { get; init; }
    public string DirectionName { get; init; } = "";

    public int? IdAlignment { get; init; }
    public string? AlignmentName { get; init; }

    public int? IdClass { get; init; }
    public string? ClassName { get; init; }

    public int? IdMainSpecializationClass { get; init; }
    public string? MainSpecializationName { get; init; }

    public int? IdSecondarySpecializationClass { get; init; }
    public string? SecondarySpecializationName { get; init; }

    public Guid? GuildPublicId { get; init; }
    public string? GuildName { get; init; }
    public string? GuildDiscriminator { get; init; }
}

public sealed class CharacterListRequest
{
    public Guid PlayerPublicId { get; init; }
}

public sealed class CharacterCreateRequest
{
    public string Pseudo { get; init; } = "";
    public int Level { get; init; }
    public int Ilvl { get; init; }
    public int Achievement { get; init; }
    public string? Sentence { get; init; }
    public bool Main { get; init; }
    public int IdRace { get; init; }
    public int IdServer { get; init; }
    public int IdDirection { get; init; }
    public int? IdAlignment { get; init; }
    public int? IdMainSpecializationClass { get; init; }
    public int? IdSecondarySpecializationClass { get; init; }
}

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

public sealed class CharacterDeleteResult
{
    public Guid PublicId { get; init; }
    public Guid? NewMainPublicId { get; init; }
}

public sealed class ReferenceItemDto
{
    public int Id { get; init; }
    public string Entitled { get; init; } = "";
}

public sealed class SpecializationClassOptionDto
{
    public int Id { get; init; }
    public string Entitled { get; init; } = "";
    public int IdClass { get; init; }
    public string SpecializationEntitled { get; init; } = "";
}

public sealed class RaceClassOptionDto
{
    public int IdRace { get; init; }
    public int IdClass { get; init; }
}

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
