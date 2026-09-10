using GamersCommunity.Core.Exceptions;
using GamersCommunity.Core.Rabbit;
using GamersCommunity.Core.Serialization;
using GamersCommunity.Core.Services;
using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Consumer.Models;
using WorldOfWarcraft.Consumer.Security;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Consumer.Services.Data;

/// <summary>
/// The shortcuts a player pins on their profile: a label, an address and the social network
/// whose icon fronts the card. Unlike media there is nothing to hide, so visitors read the
/// same list as the owner.
/// </summary>
public sealed class PlayerLinksService(WorldOfWarcraftDbContext context)
    : GenericDataService<WorldOfWarcraftDbContext, PlayerLink>(context, "PlayerLinks")
{
    private const int MaxUrlLength = 500;
    private const int MaxLabelLength = 50;
    private const int MaxIconLength = 30;
    private const int MaxLinksPerPlayer = 50;

    public override async Task<string> HandleAsync(BusMessage message, CancellationToken ct = default)
    {
        switch (message.Action?.ToUpperInvariant())
        {
            case "LIST":
                return JsonSafe.Serialize(await ListAsync(message, ct));

            case "CREATE":
                return JsonSafe.Serialize(await CreateAsync(message, ct));

            case "UPDATE":
                return JsonSafe.Serialize(await UpdateAsync(message, ct));

            case "REORDER":
                return JsonSafe.Serialize(await ReorderAsync(message, ct));

            case "DELETE":
                return JsonSafe.Serialize(await DeleteAsync(message, ct));
        }

        return await base.HandleAsync(message, ct);
    }

    private async Task<List<PlayerLinkDto>> ListAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<PlayerLinkListRequest>(message.Data);
        if (request.PlayerPublicId == Guid.Empty)
            throw new BadRequestException("INVALID_PLAYER", "Player public id is required");

        var owner = await Context.Players.AsNoTracking()
            .FirstOrDefaultAsync(p => p.PublicId == request.PlayerPublicId, ct)
            ?? throw new NotFoundException("NOT_FOUND", "Cannot find ressource");

        return await Context.PlayerLinks.AsNoTracking()
            .Where(link => link.IdPlayer == owner.Id)
            .OrderBy(link => link.Position)
            .ThenBy(link => link.CreationDate)
            .Select(link => new PlayerLinkDto
            {
                PublicId = link.PublicId,
                PlayerPublicId = owner.PublicId,
                Url = link.Url,
                Label = link.Label,
                Icon = link.Icon,
                Position = link.Position,
            })
            .ToListAsync(ct);
    }

    private async Task<PlayerLinkDto> CreateAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<PlayerLinkCreateRequest>(message.Data);
        var caller = await CallerAuth.RequirePlayerAsync(Context, message, ct);

        var owned = await Context.PlayerLinks.Where(link => link.IdPlayer == caller.Id).ToListAsync(ct);
        if (owned.Count >= MaxLinksPerPlayer)
            throw new BadRequestException("TOO_MANY_ITEMS", "You reached the maximum number of links");

        var link = new PlayerLink
        {
            PublicId = Guid.NewGuid(),
            IdPlayer = caller.Id,
            Url = ValidateUrl(request.Url),
            Label = ValidateLabel(request.Label),
            Icon = NormalizeIcon(request.Icon),
            Position = owned.Count == 0 ? 0 : owned.Max(existing => existing.Position) + 1,
            CreationDate = DateTime.UtcNow,
            ModificationDate = DateTime.UtcNow,
        };

        Context.PlayerLinks.Add(link);
        await Context.SaveChangesAsync(ct);

        return ToDto(link, caller.PublicId);
    }

    private async Task<PlayerLinkDto> UpdateAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<PlayerLinkUpdateRequest>(message.Data);
        var sent = RequestPayload.SentFields(message.Data);
        var (link, owner) = await RequireOwnedAsync(message, ct);

        if (request.Url is not null)
            link.Url = ValidateUrl(request.Url);
        if (request.Label is not null)
            link.Label = ValidateLabel(request.Label);
        // Sending the icon as null is how the owner falls back to the generic glyph.
        if (sent.Contains(nameof(PlayerLinkUpdateRequest.Icon)))
            link.Icon = NormalizeIcon(request.Icon);

        link.ModificationDate = DateTime.UtcNow;
        await Context.SaveChangesAsync(ct);

        return ToDto(link, owner.PublicId);
    }

    /// <summary>
    /// Renumbers the caller's links from the order they sent. Links left out keep their rank
    /// after the listed ones, so a stale client cannot silently shuffle what it did not know about.
    /// </summary>
    private async Task<List<PlayerLinkDto>> ReorderAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<PlayerLinkReorderRequest>(message.Data);
        var caller = await CallerAuth.RequirePlayerAsync(Context, message, ct);

        var links = await Context.PlayerLinks.Where(link => link.IdPlayer == caller.Id).ToListAsync(ct);
        var ranks = request.PublicIds
            .Select((publicId, index) => (publicId, index))
            .ToDictionary(entry => entry.publicId, entry => entry.index);

        foreach (var link in links)
        {
            link.Position = ranks.TryGetValue(link.PublicId, out var rank) ? rank : ranks.Count;
            link.ModificationDate = DateTime.UtcNow;
        }

        await Context.SaveChangesAsync(ct);

        return [.. links
            .OrderBy(link => link.Position)
            .ThenBy(link => link.CreationDate)
            .Select(link => ToDto(link, caller.PublicId))];
    }

    private async Task<PlayerLinkDeleteResult> DeleteAsync(BusMessage message, CancellationToken ct)
    {
        var (link, _) = await RequireOwnedAsync(message, ct);

        Context.PlayerLinks.Remove(link);
        await Context.SaveChangesAsync(ct);

        return new PlayerLinkDeleteResult { PublicId = link.PublicId };
    }

    private async Task<(PlayerLink Link, Player Owner)> RequireOwnedAsync(BusMessage message, CancellationToken ct)
    {
        if (message.PublicId is not Guid publicId)
            throw new BadRequestException("ID_MANDATORY", "Id mandatory");

        var caller = await CallerAuth.RequirePlayerAsync(Context, message, ct);
        var link = await Context.PlayerLinks.FirstOrDefaultAsync(l => l.PublicId == publicId, ct)
            ?? throw new NotFoundException("NOT_FOUND", "Cannot find ressource");

        if (link.IdPlayer != caller.Id)
            throw new ForbiddenException("FORBIDDEN", "Cannot alter another player's links");

        return (link, caller);
    }

    private static PlayerLinkDto ToDto(PlayerLink link, Guid playerPublicId) => new()
    {
        PublicId = link.PublicId,
        PlayerPublicId = playerPublicId,
        Url = link.Url,
        Label = link.Label,
        Icon = link.Icon,
        Position = link.Position,
    };

    private static string ValidateUrl(string url)
    {
        var value = url?.Trim() ?? string.Empty;

        if (value.Length == 0)
            throw new BadRequestException("URL_MANDATORY", "A URL is required");
        if (value.Length > MaxUrlLength)
            throw new BadRequestException("URL_TOO_LONG", $"URL cannot exceed {MaxUrlLength} characters");
        if (!Uri.TryCreate(value, UriKind.Absolute, out var uri)
            || (uri.Scheme != Uri.UriSchemeHttps && uri.Scheme != Uri.UriSchemeHttp))
            throw new BadRequestException("URL_INVALID", "URL must be an absolute http(s) address");

        return value;
    }

    private static string ValidateLabel(string label)
    {
        var value = label?.Trim() ?? string.Empty;

        if (value.Length == 0)
            throw new BadRequestException("LABEL_MANDATORY", "A label is required");
        if (value.Length > MaxLabelLength)
            throw new BadRequestException("LABEL_TOO_LONG", $"Label cannot exceed {MaxLabelLength} characters");

        return value;
    }

    /// <summary>
    /// Icon keys are stored as sent rather than checked against a list: the glyphs live in the
    /// front end, and pinning the vocabulary here would mean a back-end release per new network.
    /// An unknown key renders as the generic link icon.
    /// </summary>
    private static string? NormalizeIcon(string? icon)
    {
        var value = icon?.Trim().ToLowerInvariant();
        if (string.IsNullOrEmpty(value))
            return null;
        if (value.Length > MaxIconLength)
            throw new BadRequestException("ICON_INVALID", $"Icon key cannot exceed {MaxIconLength} characters");

        return value;
    }
}
