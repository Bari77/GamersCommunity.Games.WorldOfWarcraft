namespace WorldOfWarcraft.Consumer.Models;

public sealed class GuildLinkDto
{
    public Guid PublicId { get; init; }
    public Guid GuildPublicId { get; init; }
    public string Url { get; init; } = string.Empty;
    public string Label { get; init; } = string.Empty;
    public string? Icon { get; init; }
    public int Position { get; init; }
}

public sealed class GuildLinkListRequest
{
    public Guid GuildPublicId { get; init; }
}

public sealed class GuildLinkCreateRequest
{
    public Guid GuildPublicId { get; init; }
    public string Url { get; init; } = string.Empty;
    public string Label { get; init; } = string.Empty;
    public string? Icon { get; init; }
}

public sealed class GuildLinkUpdateRequest
{
    public string? Url { get; init; }
    public string? Label { get; init; }
    public string? Icon { get; init; }
}

public sealed class GuildLinkReorderRequest
{
    public Guid GuildPublicId { get; init; }
    public IReadOnlyList<Guid> PublicIds { get; init; } = [];
}

public sealed class GuildLinkDeleteResult
{
    public Guid PublicId { get; init; }
}
