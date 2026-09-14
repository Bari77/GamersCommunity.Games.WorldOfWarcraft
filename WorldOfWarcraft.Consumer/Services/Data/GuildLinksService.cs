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
/// The shortcuts a guild pins on its page: Discord, forum, streams. Read by anyone visiting the
/// sheet, curated by the officers who run the guild's settings.
/// </summary>
public sealed class GuildLinksService(WorldOfWarcraftDbContext context)
    : GenericDataService<WorldOfWarcraftDbContext, GuildLink>(context, "GuildLinks")
{
    private const int MaxUrlLength = 500;
    private const int MaxLabelLength = 50;
    private const int MaxIconLength = 30;
    private const int MaxLinksPerGuild = 50;

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

    private async Task<List<GuildLinkDto>> ListAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<GuildLinkListRequest>(message.Data);
        var guild = await RequireGuildAsync(request.GuildPublicId, ct);

        return await Context.GuildLinks.AsNoTracking()
            .Where(link => link.IdGuild == guild.Id)
            .OrderBy(link => link.Position)
            .ThenBy(link => link.CreationDate)
            .Select(link => new GuildLinkDto
            {
                PublicId = link.PublicId,
                GuildPublicId = guild.PublicId,
                Url = link.Url,
                Label = link.Label,
                Icon = link.Icon,
                Position = link.Position,
            })
            .ToListAsync(ct);
    }

    private async Task<GuildLinkDto> CreateAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<GuildLinkCreateRequest>(message.Data);
        var guild = await RequireGuildAsync(request.GuildPublicId, ct);
        await RequireOfficerAsync(message, guild.Id, ct);

        var owned = await Context.GuildLinks.Where(link => link.IdGuild == guild.Id).ToListAsync(ct);
        if (owned.Count >= MaxLinksPerGuild)
            throw new BadRequestException("TOO_MANY_ITEMS", "This guild reached the maximum number of links");

        var link = new GuildLink
        {
            PublicId = Guid.NewGuid(),
            IdGuild = guild.Id,
            Url = ValidateUrl(request.Url),
            Label = ValidateLabel(request.Label),
            Icon = NormalizeIcon(request.Icon),
            Position = owned.Count == 0 ? 0 : owned.Max(existing => existing.Position) + 1,
            CreationDate = DateTime.UtcNow,
            ModificationDate = DateTime.UtcNow,
        };

        Context.GuildLinks.Add(link);
        await Context.SaveChangesAsync(ct);

        return ToDto(link, guild.PublicId);
    }

    private async Task<GuildLinkDto> UpdateAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<GuildLinkUpdateRequest>(message.Data);
        var sent = RequestPayload.SentFields(message.Data);
        var (link, guild) = await RequireCuratedAsync(message, ct);

        if (request.Url is not null)
            link.Url = ValidateUrl(request.Url);
        if (request.Label is not null)
            link.Label = ValidateLabel(request.Label);
        // Sending the icon as null is how officers fall back to the generic glyph.
        if (sent.Contains(nameof(GuildLinkUpdateRequest.Icon)))
            link.Icon = NormalizeIcon(request.Icon);

        link.ModificationDate = DateTime.UtcNow;
        await Context.SaveChangesAsync(ct);

        return ToDto(link, guild.PublicId);
    }

    /// <summary>
    /// Renumbers the guild's links from the order sent. Links left out keep their rank after the
    /// listed ones, so a stale client cannot silently shuffle what it did not know about.
    /// </summary>
    private async Task<List<GuildLinkDto>> ReorderAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<GuildLinkReorderRequest>(message.Data);
        var guild = await RequireGuildAsync(request.GuildPublicId, ct);
        await RequireOfficerAsync(message, guild.Id, ct);

        var links = await Context.GuildLinks.Where(link => link.IdGuild == guild.Id).ToListAsync(ct);
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
            .Select(link => ToDto(link, guild.PublicId))];
    }

    private async Task<GuildLinkDeleteResult> DeleteAsync(BusMessage message, CancellationToken ct)
    {
        var (link, _) = await RequireCuratedAsync(message, ct);

        Context.GuildLinks.Remove(link);
        await Context.SaveChangesAsync(ct);

        return new GuildLinkDeleteResult { PublicId = link.PublicId };
    }

    private async Task<Guild> RequireGuildAsync(Guid guildPublicId, CancellationToken ct)
    {
        if (guildPublicId == Guid.Empty)
            throw new BadRequestException("VALIDATION", "Guild public id is required");

        return await Context.Guilds.AsNoTracking()
            .FirstOrDefaultAsync(g => g.PublicId == guildPublicId, ct)
            ?? throw new NotFoundException("GUILD_NOT_FOUND", "Guild not found");
    }

    private async Task RequireOfficerAsync(BusMessage message, int guildId, CancellationToken ct)
    {
        var caller = await CallerAuth.RequirePlayerAsync(Context, message, ct);
        await GuildAuth.RequireStandingAsync(Context, guildId, caller.Id, GuildRankCodes.Officer, ct);
    }

    /// <summary>Resolves the link from the route id and checks the caller runs that guild.</summary>
    private async Task<(GuildLink Link, Guild Guild)> RequireCuratedAsync(BusMessage message, CancellationToken ct)
    {
        if (message.PublicId is not Guid publicId)
            throw new BadRequestException("ID_MANDATORY", "Id mandatory");

        var link = await Context.GuildLinks.FirstOrDefaultAsync(l => l.PublicId == publicId, ct)
            ?? throw new NotFoundException("NOT_FOUND", "Cannot find ressource");

        var guild = await Context.Guilds.AsNoTracking().FirstAsync(g => g.Id == link.IdGuild, ct);
        await RequireOfficerAsync(message, guild.Id, ct);

        return (link, guild);
    }

    private static GuildLinkDto ToDto(GuildLink link, Guid guildPublicId) => new()
    {
        PublicId = link.PublicId,
        GuildPublicId = guildPublicId,
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
