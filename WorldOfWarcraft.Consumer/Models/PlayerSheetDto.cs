namespace WorldOfWarcraft.Consumer.Models;

/// <summary>Record so a read can hand back a copy with the pages a visitor may not see removed.</summary>
public sealed record PlayerSheetDto
{
    public Guid PublicId { get; init; }
    public Guid PlatformUserPublicId { get; init; }
    public string Nickname { get; init; } = "";
    public string Discriminator { get; init; } = "";
    public string AvatarUrl { get; init; } = "";
    public string? PresentationIrl { get; init; }
    public string? PresentationIg { get; init; }
    public int NbMount { get; init; }
    public int? SuccessPoints { get; init; }
    public DateTime CreationDate { get; init; }
    public int CharacterCount { get; init; }
    public string? LayoutJson { get; init; }

    /// <summary>
    /// Guild of the main character, which the sheet wears as its crest. Null while the player has
    /// no guilded character.
    /// </summary>
    public PlayerGuildDto? Guild { get; init; }
}
