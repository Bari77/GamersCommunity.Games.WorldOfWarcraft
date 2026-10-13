namespace WorldOfWarcraft.Consumer.Models;

public sealed class CharacterSummaryDto
{
    public Guid PublicId { get; init; }
    public string Pseudo { get; init; } = "";
    public int Level { get; init; }
    public int Ilvl { get; init; }
    public bool Main { get; init; }
    public DateTime CreationDate { get; init; }
    public Guid PlayerPublicId { get; init; }
    public string ServerName { get; init; } = "";
    public string RaceName { get; init; } = "";

    // Null until the character is given a specialization, which is what carries the class.
    public string? ClassName { get; init; }
    public string? MainSpecializationName { get; init; }

    public Guid? GuildPublicId { get; init; }
    public string? GuildName { get; init; }
    public string? GuildDiscriminator { get; init; }
}
