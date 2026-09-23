using GamersCommunity.Core.Exceptions;
using GamersCommunity.Core.Html;
using GamersCommunity.Core.Platform;
using GamersCommunity.Core.Rabbit;
using GamersCommunity.Core.Serialization;
using GamersCommunity.Core.Services;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using WorldOfWarcraft.Consumer.Integration;
using WorldOfWarcraft.Consumer.Models;
using WorldOfWarcraft.Consumer.Security;
using WorldOfWarcraft.Consumer.Workspace;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Consumer.Services.Data;

public class PlayersService(WorldOfWarcraftDbContext context, IPlatformFriendsClient friendsClient)
    : GenericDataService<WorldOfWarcraftDbContext, Player>(context, "Players")
{
    private const int MaxLayoutLength = 32000;
    private const int MaxSearchTake = 50;

    /// <summary>Ceilings loose enough for any expansion, tight enough to reject a typo.</summary>
    private const int MaxMounts = 2000;

    private const int MaxSuccessPoints = 200000;

    /// <summary>Presentation fields are free text, capped so a sheet stays readable.</summary>
    private const int MaxPresentationLength = 4000;

    public override async Task<string> HandleAsync(BusMessage message, CancellationToken ct = default)
    {
        switch (message.Action)
        {
            case "Load":
                return JsonSafe.Serialize(await LoadAsync(message, ct));

            case "Resolve":
                return JsonSafe.Serialize(await ResolveByPlatformUserAsync(message, ct));

            case "Search":
                return JsonSafe.Serialize(await SearchAsync(message, ct));

            case "Get":
                return JsonSafe.Serialize(await GetSheetAsync(message, ct));

            case "Update":
                return JsonSafe.Serialize(await UpdateSheetAsync(message, ct));
        }

        return await base.HandleAsync(message, ct);
    }

    private async Task<PlayerSheetDto> LoadAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<PlayerLoadRequest>(message.Data);
        if (request.PlatformUserId <= 0 || request.PlatformUserPublicId == Guid.Empty)
            throw new BadRequestException("INVALID_PLATFORM_USER", "Platform user identity is required");

        var idKeycloak = CallerAuth.RequireKeycloakId(message);
        var player = await Context.Players.FirstOrDefaultAsync(p => p.IdKeycloak == idKeycloak, ct);

        if (player is null)
        {
            player = new Player
            {
                PublicId = Guid.NewGuid(),
                IdKeycloak = idKeycloak,
                PlatformUserPublicId = request.PlatformUserPublicId,
                IdUser = request.PlatformUserId,
                CreationDate = DateTime.UtcNow,
                ModificationDate = DateTime.UtcNow,
            };
            await Context.Players.AddAsync(player, ct);
            await Context.SaveChangesAsync(ct);
        }
        else if (player.PlatformUserPublicId != request.PlatformUserPublicId || player.IdUser != request.PlatformUserId)
        {
            player.PlatformUserPublicId = request.PlatformUserPublicId;
            player.IdUser = request.PlatformUserId;
            player.ModificationDate = DateTime.UtcNow;
            await Context.SaveChangesAsync(ct);
        }

        return await ToSheetDtoAsync(player.Id, ct);
    }

    private async Task<PlayerResolveResult> ResolveByPlatformUserAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<PlayerResolveRequest>(message.Data);
        if (request.PlatformUserPublicId == Guid.Empty)
            throw new BadRequestException("INVALID_PLATFORM_USER", "Platform user public id is required");

        var player = await Context.Players.AsNoTracking()
            .FirstOrDefaultAsync(p => p.PlatformUserPublicId == request.PlatformUserPublicId, ct);

        return new PlayerResolveResult
        {
            PlayerPublicId = player?.PublicId,
        };
    }

    /// <summary>
    /// Searches players by their Platform nickname. The nickname lives in the local snapshot table,
    /// so the query never leaves the microservice.
    /// </summary>
    private async Task<PlayerSearchResultDto> SearchAsync(BusMessage message, CancellationToken ct)
    {
        var request = string.IsNullOrWhiteSpace(message.Data)
            ? new PlayerSearchRequest()
            : ConsumerParamParser.ToObject<PlayerSearchRequest>(message.Data);

        var take = request.Take is > 0 and <= MaxSearchTake ? request.Take : 20;

        // A player without a Platform identity has no name to match and no sheet worth linking to.
        var query = Context.Players.AsNoTracking().Where(p => p.PlatformUserPublicId != null);

        if (!string.IsNullOrWhiteSpace(request.Query))
        {
            var (name, discriminator) = SearchHandle.Split(request.Query);

            query = discriminator is null
                ? query.Where(p => Context.PlatformUserSnapshots.Any(s =>
                    s.PlatformUserPublicId == p.PlatformUserPublicId && s.Nickname.Contains(name)))
                : query.Where(p => Context.PlatformUserSnapshots.Any(s =>
                    s.PlatformUserPublicId == p.PlatformUserPublicId
                    && s.Nickname.Contains(name)
                    && s.Discriminator == discriminator));
        }

        if (request.IdServer is { } idServer)
            query = query.Where(p => p.Characters.Any(c => c.IdServer == idServer));

        if (request.BeforePublicId is { } beforePublicId && request.BeforeCreationDate is { } beforeDate)
        {
            query = query.Where(p =>
                p.CreationDate < beforeDate
                || (p.CreationDate == beforeDate && p.PublicId.CompareTo(beforePublicId) < 0));
        }

        // One extra row tells the client whether another page exists, without a second count query.
        var rows = await query
            .OrderByDescending(p => p.CreationDate)
            .ThenByDescending(p => p.PublicId)
            .Take(take + 1)
            .Select(p => new PlayerSummaryDto
            {
                PublicId = p.PublicId,
                PlatformUserPublicId = p.PlatformUserPublicId ?? Guid.Empty,
                Nickname = Context.PlatformUserSnapshots
                    .Where(s => s.PlatformUserPublicId == p.PlatformUserPublicId)
                    .Select(s => s.Nickname)
                    .FirstOrDefault() ?? "Player",
                Discriminator = Context.PlatformUserSnapshots
                    .Where(s => s.PlatformUserPublicId == p.PlatformUserPublicId)
                    .Select(s => s.Discriminator)
                    .FirstOrDefault() ?? "0000",
                AvatarUrl = Context.PlatformUserSnapshots
                    .Where(s => s.PlatformUserPublicId == p.PlatformUserPublicId)
                    .Select(s => s.AvatarUrl)
                    .FirstOrDefault() ?? "",
                PresentationIrl = p.PresentationIrl,
                CreationDate = p.CreationDate,
                CharacterCount = p.Characters.Count,
            })
            .ToListAsync(ct);

        var hasMore = rows.Count > take;
        if (hasMore)
            rows.RemoveAt(rows.Count - 1);

        return new PlayerSearchResultDto { Items = rows, HasMore = hasMore };
    }

    private async Task<PlayerSheetDto> GetSheetAsync(BusMessage message, CancellationToken ct)
    {
        var player = await ResolvePlayerAsync(message, ct);
        var sheet = await ToSheetDtoAsync(player.Id, ct);

        var callerId = await CallerAuth.FindPlayerIdAsync(Context, message, ct);
        if (callerId == player.Id)
            return sheet;

        return sheet with { LayoutJson = await FilterPagesAsync(sheet, message, ct) };
    }

    /// <summary>
    /// Drops the pages the visitor is not part of the audience of. The owner keeps them all, a
    /// friend keeps the friends-only ones, and everybody else only sees the public ones.
    /// </summary>
    private async Task<string?> FilterPagesAsync(PlayerSheetDto sheet, BusMessage message, CancellationToken ct)
    {
        var friends = false;
        if (WorkspaceVisibility.Mentions(sheet.LayoutJson, PageVisibilityCodes.Friends))
        {
            var visitor = await CallerAuth.FindPlatformUserPublicIdAsync(Context, message, ct);
            if (visitor is { } visitorPublicId)
                friends = await friendsClient.AreFriendsAsync(visitorPublicId, sheet.PlatformUserPublicId, ct);
        }

        return WorkspaceVisibility.Filter(
            sheet.LayoutJson,
            visibility => visibility switch
            {
                PageVisibilityCodes.Friends => friends,
                PageVisibilityCodes.Private => false,
                _ => true,
            });
    }

    private async Task<PlayerSheetDto> UpdateSheetAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<PlayerUpdateRequest>(message.Data);
        var sent = RequestPayload.SentFields(message.Data);
        var caller = await CallerAuth.RequirePlayerAsync(Context, message, ct);
        var target = await Context.Players
            .FirstOrDefaultAsync(p => message.PublicId != null && p.PublicId == message.PublicId, ct)
            ?? throw new NotFoundException("NOT_FOUND", "Cannot find ressource");

        if (caller.Id != target.Id)
            throw new ForbiddenException("FORBIDDEN", "Cannot update another player's sheet");

        // Widgets edit one field at a time, and an empty value sent on purpose clears it.
        if (sent.Contains(nameof(PlayerUpdateRequest.PresentationIrl)))
            target.PresentationIrl = NormalizePresentation(request.PresentationIrl);
        if (sent.Contains(nameof(PlayerUpdateRequest.PresentationIg)))
            target.PresentationIg = NormalizePresentation(request.PresentationIg);
        if (sent.Contains(nameof(PlayerUpdateRequest.NbMount)))
            target.NbMount = ValidateCount(request.NbMount, MaxMounts, "Mount count");
        if (sent.Contains(nameof(PlayerUpdateRequest.SuccessPoints)))
            target.SuccessPoints = request.SuccessPoints is null
                ? null
                : ValidateCount(request.SuccessPoints, MaxSuccessPoints, "Achievement points");
        if (sent.Contains(nameof(PlayerUpdateRequest.LayoutJson)))
            target.LayoutJson = NormalizeLayout(request.LayoutJson ?? "");

        target.ModificationDate = DateTime.UtcNow;
        await Context.SaveChangesAsync(ct);

        return await ToSheetDtoAsync(target.Id, ct);
    }

    /// <summary>
    /// The widget catalog lives in the front, so the layout is stored opaquely.
    /// Only the shape (a JSON object for the paged workspace, or the legacy flat
    /// array) and a size ceiling are enforced here.
    /// </summary>
    private static string? NormalizeLayout(string layoutJson)
    {
        if (string.IsNullOrWhiteSpace(layoutJson))
            return null;

        if (layoutJson.Length > MaxLayoutLength)
            throw new BadRequestException("LAYOUT_TOO_LARGE", "Layout payload is too large");

        try
        {
            using var document = JsonDocument.Parse(layoutJson);
            if (document.RootElement.ValueKind is not (JsonValueKind.Object or JsonValueKind.Array))
                throw new BadRequestException("LAYOUT_INVALID", "Layout must be a JSON object or array");
        }
        catch (JsonException)
        {
            throw new BadRequestException("LAYOUT_INVALID", "Layout must be a JSON object or array");
        }

        return layoutJson;
    }

    private static string? NormalizePresentation(string? value)
    {
        var html = RichHtml.SanitizeOptional(value);
        if (html != null && html.Length > MaxPresentationLength)
            throw new BadRequestException("VALIDATION", $"Text must be at most {MaxPresentationLength} characters");

        return html;
    }

    private static int ValidateCount(int? value, int max, string label)
    {
        if (value is not { } count || count < 0 || count > max)
            throw new BadRequestException("VALIDATION", $"{label} must be between 0 and {max}");

        return count;
    }

    private async Task<Player> ResolvePlayerAsync(BusMessage message, CancellationToken ct)
    {
        if (message.PublicId is Guid publicId)
            return await Context.Players.AsNoTracking()
                       .FirstOrDefaultAsync(p => p.PublicId == publicId, ct)
                   ?? throw new NotFoundException("NOT_FOUND", "Cannot find ressource");

        if (message.Id is int id)
            return await Context.Players.AsNoTracking()
                       .FirstOrDefaultAsync(p => p.Id == id, ct)
                   ?? throw new NotFoundException("NOT_FOUND", "Cannot find ressource");

        throw new BadRequestException("ID_MANDATORY", "Id mandatory");
    }

    private async Task<PlayerSheetDto> ToSheetDtoAsync(int playerId, CancellationToken ct)
    {
        var player = await Context.Players.AsNoTracking()
            .Where(p => p.Id == playerId)
            .Select(p => new
            {
                p.PublicId,
                p.PlatformUserPublicId,
                p.PresentationIrl,
                p.PresentationIg,
                p.NbMount,
                p.SuccessPoints,
                p.CreationDate,
                p.LayoutJson,
                CharacterCount = p.Characters.Count,
                // The sheet wears the crest of the guild the player mains in.
                Guild = p.Characters
                    .OrderByDescending(c => c.Main)
                    .ThenByDescending(c => c.Level)
                    .SelectMany(c => c.GuildMembers)
                    .Select(m => new PlayerGuildDto
                    {
                        PublicId = m.IdGuildNavigation.PublicId,
                        Entitled = m.IdGuildNavigation.Entitled,
                        Discriminator = m.IdGuildNavigation.Discriminator,
                        Rank = m.IdGuildRankNavigation.Entitled,
                        Crest = new GuildCrestDto
                        {
                            Emblem = m.IdGuildNavigation.CrestEmblem,
                            EmblemColor = m.IdGuildNavigation.CrestEmblemColor,
                            Border = m.IdGuildNavigation.CrestBorder,
                            BorderColor = m.IdGuildNavigation.CrestBorderColor,
                            BackgroundColor = m.IdGuildNavigation.CrestBackgroundColor,
                            Faction = m.IdGuildNavigation.IdLeaderNavigation.IdAlignmentNavigation != null
                                ? m.IdGuildNavigation.IdLeaderNavigation.IdAlignmentNavigation.Entitled
                                : null,
                        },
                    })
                    .FirstOrDefault(),
                Snapshot = Context.PlatformUserSnapshots
                    .Where(s => s.PlatformUserPublicId == p.PlatformUserPublicId)
                    .Select(s => new { s.Nickname, s.Discriminator, s.AvatarUrl })
                    .FirstOrDefault(),
            })
            .FirstAsync(ct);

        return new PlayerSheetDto
        {
            PublicId = player.PublicId,
            PlatformUserPublicId = player.PlatformUserPublicId ?? Guid.Empty,
            Nickname = player.Snapshot?.Nickname ?? "",
            Discriminator = player.Snapshot?.Discriminator ?? "",
            AvatarUrl = player.Snapshot?.AvatarUrl ?? "",
            PresentationIrl = player.PresentationIrl,
            PresentationIg = player.PresentationIg,
            NbMount = player.NbMount,
            SuccessPoints = player.SuccessPoints,
            CreationDate = player.CreationDate,
            CharacterCount = player.CharacterCount,
            LayoutJson = player.LayoutJson,
            Guild = player.Guild,
        };
    }
}
