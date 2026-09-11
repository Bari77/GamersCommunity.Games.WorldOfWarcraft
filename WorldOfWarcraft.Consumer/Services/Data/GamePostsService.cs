using GamersCommunity.Core.Enums;
using GamersCommunity.Core.Exceptions;
using GamersCommunity.Core.Rabbit;
using GamersCommunity.Core.Serialization;
using GamersCommunity.Core.Services;
using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Consumer.Integration;
using WorldOfWarcraft.Consumer.Models;
using WorldOfWarcraft.Consumer.Security;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Consumer.Services.Data;

/// <summary>
/// Guild wall, moderated by the guild itself: leader and officers publish straight away, members go
/// through a review queue.
/// </summary>
public class GamePostsService(
    WorldOfWarcraftDbContext context,
    IPlatformSanctionsClient sanctions) : IBusService
{
    private const int MaxTake = 50;
    private const int MaxBodyLength = 4000;
    private const int MaxReasonLength = 500;
    private readonly WorldOfWarcraftDbContext _context = context;

    BusServiceTypeEnum IBusService.Type => BusServiceTypeEnum.DATA;
    public string Resource => "GamePosts";

    public async Task<string> HandleAsync(BusMessage message, CancellationToken ct = default)
    {
        switch (message.Action)
        {
            case "ListGuildWall":
                return JsonSafe.Serialize(await ListGuildWallAsync(message, ct));

            case "ListPending":
                return JsonSafe.Serialize(await ListPendingAsync(message, ct));

            case "Create":
                return JsonSafe.Serialize(await CreateAsync(message, ct));

            case "Moderate":
                return JsonSafe.Serialize(await ModerateAsync(message, ct));

            case "Delete":
                return JsonSafe.Serialize(await DeleteAsync(message, ct));
        }

        throw new InternalServerErrorException("ACTION_NOT_IMPLEMENTED", $"Action {message.Action} not implemented");
    }

    private async Task<GamePostPageDto> ListGuildWallAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<GuildWallRequest>(message.Data);
        var guildId = await RequireGuildIdAsync(request.GuildPublicId, ct);
        var take = request.Take is > 0 and <= MaxTake ? request.Take : 20;

        var query = _context.GamePosts.AsNoTracking()
            .Where(p => p.IdGuild == guildId
                        && p.IdStatusNavigation.Entitled == GamePostStatusCodes.Approved);

        if (request.BeforePublicId is { } beforePublicId && request.BeforeCreationDate is { } beforeDate)
        {
            query = query.Where(p =>
                p.CreationDate < beforeDate
                || (p.CreationDate == beforeDate && p.PublicId.CompareTo(beforePublicId) < 0));
        }

        return await PageAsync(query, take, ct);
    }

    private async Task<GamePostPageDto> ListPendingAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<GuildWallRequest>(message.Data);
        var guildId = await RequireGuildIdAsync(request.GuildPublicId, ct);

        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        await GuildAuth.RequireStandingAsync(_context, guildId, caller.Id, GuildRankCodes.Officer, ct);

        var take = request.Take is > 0 and <= MaxTake ? request.Take : 20;
        var query = _context.GamePosts.AsNoTracking()
            .Where(p => p.IdGuild == guildId
                        && p.IdStatusNavigation.Entitled == GamePostStatusCodes.Pending);

        return await PageAsync(query, take, ct);
    }

    private async Task<GamePostDto> CreateAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<GamePostCreateRequest>(message.Data);
        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        await sanctions.EnsureCanPublishAsync(message, ct);

        var body = (request.Body ?? "").Trim();
        if (body.Length == 0)
            throw new BadRequestException("VALIDATION", "Post body is required");
        if (body.Length > MaxBodyLength)
            throw new BadRequestException("BODY_TOO_LONG", $"Post cannot exceed {MaxBodyLength} characters");

        var guildId = await RequireGuildIdAsync(request.GuildPublicId, ct);
        var standing = await GuildAuth.RequireStandingAsync(
            _context, guildId, caller.Id, GuildRankCodes.Member, ct);

        // Officers are trusted by construction, so only member posts feed the review queue.
        var status = GuildAuth.CanModerate(standing.Rank)
            ? GamePostStatusCodes.Approved
            : GamePostStatusCodes.Pending;

        var now = DateTime.UtcNow;
        var post = new GamePost
        {
            PublicId = Guid.NewGuid(),
            IdPlayer = caller.Id,
            IdGuild = guildId,
            Body = body,
            MediaUrl = NormalizeMediaUrl(request.MediaUrl),
            MediaKind = Normalize(request.MediaKind),
            IdStatus = await RequireStatusIdAsync(status, ct),
            CreationDate = now,
            ModificationDate = now,
        };

        if (status == GamePostStatusCodes.Approved)
        {
            post.IdModerator = standing.ActingCharacterId;
            post.ModeratedAt = now;
        }

        await _context.GamePosts.AddAsync(post, ct);
        await _context.SaveChangesAsync(ct);

        return await ToDtoAsync(post.Id, ct);
    }

    private async Task<GamePostDto> ModerateAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<GamePostModerateRequest>(message.Data);
        var post = await RequirePostAsync(request.PublicId, ct);

        if (post.IdGuild is not { } guildId)
            throw new BadRequestException("NOT_A_GUILD_POST", "Only guild posts are moderated by a guild");

        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        var standing = await GuildAuth.RequireStandingAsync(
            _context, guildId, caller.Id, GuildRankCodes.Officer, ct);

        var reason = Normalize(request.Reason);
        if (reason is not null && reason.Length > MaxReasonLength)
            throw new BadRequestException("REASON_TOO_LONG", $"Reason cannot exceed {MaxReasonLength} characters");

        post.IdStatus = await RequireStatusIdAsync(
            request.Approve ? GamePostStatusCodes.Approved : GamePostStatusCodes.Rejected,
            ct);
        post.IdModerator = standing.ActingCharacterId;
        post.ModeratedAt = DateTime.UtcNow;
        post.ModerationReason = reason;
        post.ModificationDate = post.ModeratedAt.Value;

        await _context.SaveChangesAsync(ct);

        return await ToDtoAsync(post.Id, ct);
    }

    private async Task<GamePostTargetRequest> DeleteAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<GamePostTargetRequest>(message.Data);
        var post = await RequirePostAsync(request.PublicId, ct);
        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);

        if (post.IdPlayer != caller.Id)
        {
            if (post.IdGuild is not { } guildId)
                throw new ForbiddenException("FORBIDDEN", "Only the author can delete this post");

            await GuildAuth.RequireStandingAsync(_context, guildId, caller.Id, GuildRankCodes.Officer, ct);
        }

        _context.GamePosts.Remove(post);
        await _context.SaveChangesAsync(ct);

        return new GamePostTargetRequest { PublicId = post.PublicId };
    }

    /// <summary>
    /// Reads one row past the page so the client knows whether to keep paging, without a count.
    /// </summary>
    private async Task<GamePostPageDto> PageAsync(IQueryable<GamePost> query, int take, CancellationToken ct)
    {
        var rows = await Project(query
                .OrderByDescending(p => p.CreationDate)
                .ThenByDescending(p => p.PublicId)
                .Take(take + 1))
            .ToListAsync(ct);

        var hasMore = rows.Count > take;
        if (hasMore)
            rows.RemoveAt(rows.Count - 1);

        return new GamePostPageDto { Items = rows, HasMore = hasMore };
    }

    private async Task<int> RequireGuildIdAsync(Guid guildPublicId, CancellationToken ct)
    {
        if (guildPublicId == Guid.Empty)
            throw new BadRequestException("VALIDATION", "Guild public id is required");

        return await _context.Guilds.AsNoTracking()
            .Where(g => g.PublicId == guildPublicId)
            .Select(g => (int?)g.Id)
            .FirstOrDefaultAsync(ct)
            ?? throw new NotFoundException("GUILD_NOT_FOUND", "Guild not found");
    }

    private async Task<GamePost> RequirePostAsync(Guid publicId, CancellationToken ct)
    {
        if (publicId == Guid.Empty)
            throw new BadRequestException("VALIDATION", "Post public id is required");

        return await _context.GamePosts.FirstOrDefaultAsync(p => p.PublicId == publicId, ct)
            ?? throw new NotFoundException("POST_NOT_FOUND", "Post not found");
    }

    private async Task<int> RequireStatusIdAsync(string code, CancellationToken ct) =>
        await _context.GamePostStatuses.AsNoTracking()
            .Where(s => s.Entitled == code)
            .Select(s => s.Id)
            .FirstOrDefaultAsync(ct) is var id && id != 0
            ? id
            : throw new BadRequestException("INVALID_STATUS", $"Unknown post status '{code}'");

    private IQueryable<GamePostDto> Project(IQueryable<GamePost> posts) =>
        posts.Select(p => new GamePostDto
        {
            PublicId = p.PublicId,
            GuildPublicId = p.IdGuildNavigation != null ? p.IdGuildNavigation.PublicId : null,
            GuildName = p.IdGuildNavigation != null ? p.IdGuildNavigation.Entitled : null,
            GuildDiscriminator = p.IdGuildNavigation != null ? p.IdGuildNavigation.Discriminator : null,
            Body = p.Body,
            MediaUrl = p.MediaUrl,
            MediaKind = p.MediaKind,
            Status = p.IdStatusNavigation.Entitled,
            CreationDate = p.CreationDate,
            AuthorPlayerPublicId = p.IdPlayerNavigation.PublicId,
            AuthorPlatformUserPublicId = p.IdPlayerNavigation.PlatformUserPublicId ?? Guid.Empty,
            AuthorNickname = _context.PlatformUserSnapshots
                .Where(s => (Guid?)s.PlatformUserPublicId == p.IdPlayerNavigation.PlatformUserPublicId)
                .Select(s => s.Nickname)
                .FirstOrDefault() ?? "Player",
            AuthorDiscriminator = _context.PlatformUserSnapshots
                .Where(s => (Guid?)s.PlatformUserPublicId == p.IdPlayerNavigation.PlatformUserPublicId)
                .Select(s => s.Discriminator)
                .FirstOrDefault() ?? "0000",
            AuthorAvatarUrl = _context.PlatformUserSnapshots
                .Where(s => (Guid?)s.PlatformUserPublicId == p.IdPlayerNavigation.PlatformUserPublicId)
                .Select(s => s.AvatarUrl)
                .FirstOrDefault() ?? "",
            ModerationReason = p.ModerationReason,
            ModeratedAt = p.ModeratedAt,
        });

    private async Task<GamePostDto> ToDtoAsync(int postId, CancellationToken ct) =>
        await Project(_context.GamePosts.AsNoTracking().Where(p => p.Id == postId)).FirstAsync(ct);

    private static string? Normalize(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();

    private static string? NormalizeMediaUrl(string? value)
    {
        var url = Normalize(value);
        if (url is null)
            return null;

        if (url.Length > 500)
            throw new BadRequestException("MEDIA_URL_TOO_LONG", "Media URL cannot exceed 500 characters");

        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri) || (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps))
            throw new BadRequestException("INVALID_MEDIA_URL", "Media URL must be an absolute http(s) URL");

        return url;
    }
}
