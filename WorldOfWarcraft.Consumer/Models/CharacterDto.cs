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

    /// <summary>See <see cref="WorldOfWarcraft.Database.Models.GuildRankCodes"/>. Null when unguilded.</summary>
    public string? GuildRank { get; init; }

    /// <summary>Crest of that guild, so a character card can wear it. Null when unguilded.</summary>
    public GuildCrestDto? GuildCrest { get; init; }
}
