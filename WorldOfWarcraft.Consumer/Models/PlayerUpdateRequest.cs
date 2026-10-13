namespace WorldOfWarcraft.Consumer.Models;

/// <summary>
/// Partial update of a sheet: the presence of a field in the payload is what marks it for saving,
/// so a widget can send the single field it edits and an empty value means "erase".
/// </summary>
public sealed class PlayerUpdateRequest
{
    public string? PresentationIrl { get; init; }
    public string? PresentationIg { get; init; }
    public int? NbMount { get; init; }
    public int? SuccessPoints { get; init; }
    public string? LayoutJson { get; init; }
}
