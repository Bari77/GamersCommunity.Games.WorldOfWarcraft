namespace WorldOfWarcraft.Consumer.Models;

public sealed class PlayerLinkDto
{
    public Guid PublicId { get; init; }
    public Guid PlayerPublicId { get; init; }
    public string Url { get; init; } = string.Empty;
    public string Label { get; init; } = string.Empty;
    public string? Icon { get; init; }
    public int Position { get; init; }
}

public sealed class PlayerLinkListRequest
{
    public Guid PlayerPublicId { get; init; }
}

public sealed class PlayerLinkCreateRequest
{
    public string Url { get; init; } = string.Empty;
    public string Label { get; init; } = string.Empty;
    public string? Icon { get; init; }
}

public sealed class PlayerLinkUpdateRequest
{
    public string? Url { get; init; }
    public string? Label { get; init; }
    public string? Icon { get; init; }
}

public sealed class PlayerLinkReorderRequest
{
    public IReadOnlyList<Guid> PublicIds { get; init; } = [];
}

public sealed class PlayerLinkDeleteResult
{
    public Guid PublicId { get; init; }
}
