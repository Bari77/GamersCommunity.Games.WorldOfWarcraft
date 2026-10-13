namespace WorldOfWarcraft.Consumer.Models;

public sealed class ListLfgRecentRequest
{
    /// <summary>See <see cref="WorldOfWarcraft.Database.Models.LfgAdKinds"/>. Defaults to player ads.</summary>
    public string? Kind { get; init; }
}
