using GamersCommunity.Core.Enums;
using GamersCommunity.Core.Exceptions;
using GamersCommunity.Core.Rabbit;
using GamersCommunity.Core.Serialization;
using GamersCommunity.Core.Services;
using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Consumer.Integration;
using WorldOfWarcraft.Consumer.Models;
using WorldOfWarcraft.Consumer.Realtime;
using WorldOfWarcraft.Consumer.Security;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Consumer.Services.Data;

public class LfgAdsService(
    WorldOfWarcraftDbContext context,
    IRealtimeEventPublisher realtimePublisher,
    IPlatformSanctionsClient sanctions) : IBusService
{
    private const int RecentTake = 50;
    private static readonly TimeSpan PostCooldown = TimeSpan.FromMinutes(3);
    private readonly WorldOfWarcraftDbContext _context = context;

    BusServiceTypeEnum IBusService.Type => BusServiceTypeEnum.DATA;
    public string Resource => "LfgAds";

    public async Task<string> HandleAsync(BusMessage message, CancellationToken ct = default)
    {
        switch (message.Action)
        {
            case "ListRecent":
                return JsonSafe.Serialize(await ListRecentAsync(message, ct));

            case "ListBefore":
                return JsonSafe.Serialize(await ListBeforeAsync(message, ct));

            case "Search":
                return JsonSafe.Serialize(await SearchAsync(message, ct));

            case "Create":
                return JsonSafe.Serialize(await CreateAsync(message, ct));
        }

        throw new InternalServerErrorException("ACTION_NOT_IMPLEMENTED", $"Action {message.Action} not implemented");
    }

    private async Task<List<LfgAdSummaryDto>> ListRecentAsync(BusMessage message, CancellationToken ct)
    {
        var kind = ResolveKind(string.IsNullOrWhiteSpace(message.Data)
            ? null
            : ConsumerParamParser.ToObject<ListLfgRecentRequest>(message.Data).Kind);

        var now = DateTime.UtcNow;
        var messages = await ToSummaries(_context.LfgAds.AsNoTracking()
            .Where(ad => ad.IsActive && ad.ExpiresAt > now && ad.Kind == kind)
            .OrderByDescending(ad => ad.CreationDate)
            .ThenByDescending(ad => ad.PublicId)
            .Take(RecentTake))
            .ToListAsync(ct);

        messages.Reverse();
        return messages;
    }

    /// <summary>
    /// Player ads and guild recruitment live in the same table but feed two separate threads, so
    /// every listing is scoped to one kind.
    /// </summary>
    private static string ResolveKind(string? requested)
    {
        if (string.IsNullOrWhiteSpace(requested))
            return LfgAdKinds.LookingForGroup;

        var kind = requested.Trim().ToLowerInvariant();
        if (!LfgAdKinds.IsKnown(kind))
            throw new BadRequestException("VALIDATION", $"Unknown LFG kind '{requested}'");

        return kind;
    }

    private async Task<List<LfgAdSummaryDto>> ListBeforeAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<ListLfgBeforeRequest>(message.Data);
        if (request.BeforePublicId == Guid.Empty)
            throw new BadRequestException("VALIDATION", "Cursor is required");

        var kind = ResolveKind(request.Kind);
        var take = request.Take is > 0 and <= RecentTake ? request.Take : RecentTake;
        var now = DateTime.UtcNow;
        var messages = await ToSummaries(_context.LfgAds.AsNoTracking()
            .Where(ad => ad.IsActive && ad.ExpiresAt > now && ad.Kind == kind)
            .Where(ad =>
                ad.CreationDate < request.BeforeCreationDate
                || (ad.CreationDate == request.BeforeCreationDate && ad.PublicId.CompareTo(request.BeforePublicId) < 0))
            .OrderByDescending(ad => ad.CreationDate)
            .ThenByDescending(ad => ad.PublicId)
            .Take(take))
            .ToListAsync(ct);

        messages.Reverse();
        return messages;
    }

    /// <summary>
    /// Resolves the author identity from the local Platform snapshot rather than trusting the
    /// caller, and attaches the guild handle when the ad was published on its behalf.
    /// </summary>
    private IQueryable<LfgAdSummaryDto> ToSummaries(IQueryable<LfgAd> ads) =>
        ads.Select(ad => new LfgAdSummaryDto
        {
            PublicId = ad.PublicId,
            Kind = ad.Kind,
            Body = ad.Body,
            CreationDate = ad.CreationDate,
            ExpiresAt = ad.ExpiresAt,
            PlayerPublicId = ad.IdPlayerNavigation.PublicId,
            PlatformUserPublicId = ad.IdPlayerNavigation.PlatformUserPublicId ?? Guid.Empty,
            SenderNickname = _context.PlatformUserSnapshots
                .Where(s => (Guid?)s.PlatformUserPublicId == ad.IdPlayerNavigation.PlatformUserPublicId)
                .Select(s => s.Nickname)
                .FirstOrDefault() ?? "Player",
            SenderDiscriminator = _context.PlatformUserSnapshots
                .Where(s => (Guid?)s.PlatformUserPublicId == ad.IdPlayerNavigation.PlatformUserPublicId)
                .Select(s => s.Discriminator)
                .FirstOrDefault() ?? "0000",
            SenderAvatarUrl = _context.PlatformUserSnapshots
                .Where(s => (Guid?)s.PlatformUserPublicId == ad.IdPlayerNavigation.PlatformUserPublicId)
                .Select(s => s.AvatarUrl)
                .FirstOrDefault() ?? "",
            GuildPublicId = ad.IdGuildNavigation != null ? ad.IdGuildNavigation.PublicId : null,
            GuildName = ad.IdGuildNavigation != null ? ad.IdGuildNavigation.Entitled : null,
            GuildDiscriminator = ad.IdGuildNavigation != null ? ad.IdGuildNavigation.Discriminator : null,
            ServerName = ad.IdServerNavigation != null ? ad.IdServerNavigation.Entitled : null,
            DirectionName = ad.IdDirectionNavigation != null ? ad.IdDirectionNavigation.Entitled : null,
        });

    /// <summary>
    /// Board listing: same rows as the live rails, but filterable and paged oldest-page-last instead
    /// of being replayed as a chat thread.
    /// </summary>
    private async Task<LfgAdPageDto> SearchAsync(BusMessage message, CancellationToken ct)
    {
        var request = string.IsNullOrWhiteSpace(message.Data)
            ? new SearchLfgRequest()
            : ConsumerParamParser.ToObject<SearchLfgRequest>(message.Data);

        var kind = ResolveKind(request.Kind);
        var take = request.Take is > 0 and <= RecentTake ? request.Take : 20;
        var now = DateTime.UtcNow;

        var query = _context.LfgAds.AsNoTracking()
            .Where(ad => ad.IsActive && ad.ExpiresAt > now && ad.Kind == kind);

        if (!string.IsNullOrWhiteSpace(request.Query))
        {
            var text = request.Query.Trim();
            query = query.Where(ad => ad.Body.Contains(text));
        }

        if (request.IdServer is { } idServer)
            query = query.Where(ad => ad.IdServer == idServer);

        if (request.IdDirection is { } idDirection)
            query = query.Where(ad => ad.IdDirection == idDirection);

        if (request.BeforePublicId is { } beforePublicId && request.BeforeCreationDate is { } beforeDate)
        {
            query = query.Where(ad =>
                ad.CreationDate < beforeDate
                || (ad.CreationDate == beforeDate && ad.PublicId.CompareTo(beforePublicId) < 0));
        }

        // One extra row tells the client whether another page exists, without a second count query.
        var rows = await ToSummaries(query
                .OrderByDescending(ad => ad.CreationDate)
                .ThenByDescending(ad => ad.PublicId)
                .Take(take + 1))
            .ToListAsync(ct);

        var hasMore = rows.Count > take;
        if (hasMore)
            rows.RemoveAt(rows.Count - 1);

        return new LfgAdPageDto { Items = rows, HasMore = hasMore };
    }

    private async Task<LfgAdSummaryDto> CreateAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<CreateLfgAdRequest>(message.Data);
        if (string.IsNullOrWhiteSpace(request.Body))
            throw new BadRequestException("VALIDATION", "Message is required");

        await sanctions.EnsureCanPublishAsync(message, ct);

        var player = await GetOrCreatePlayerAsync(message, request, ct);
        var guild = request.GuildPublicId is { } guildPublicId
            ? await RequirePostableGuildAsync(player.Id, guildPublicId, ct)
            : null;

        var postedAt = DateTime.UtcNow;
        await EnsureNotInCooldownAsync(player.Id, guild?.Id, postedAt, ct);

        var (idServer, idDirection) = await ResolveScopeAsync(player.Id, guild, ct);

        var ad = new LfgAd
        {
            PublicId = Guid.NewGuid(),
            IdPlayer = player.Id,
            IdGuild = guild?.Id,
            IdServer = idServer,
            IdDirection = idDirection,
            Kind = guild is null ? LfgAdKinds.LookingForGroup : LfgAdKinds.Recruitment,
            Title = string.Empty,
            Body = request.Body.Trim(),
            CreationDate = postedAt,
            ModificationDate = postedAt,
            ExpiresAt = request.ExpiresAt is { } custom && custom > postedAt ? custom : postedAt.AddDays(7),
            IsActive = true,
        };

        await _context.LfgAds.AddAsync(ad, ct);
        await _context.SaveChangesAsync(ct);

        var dto = await ToSummaries(_context.LfgAds.AsNoTracking().Where(a => a.Id == ad.Id))
            .FirstAsync(ct);

        await realtimePublisher.PublishAsync(
            new LfgMessageCreatedRealtimeEvent
            {
                Message = new LfgMessageRealtimePayload
                {
                    PublicId = dto.PublicId,
                    Kind = dto.Kind,
                    Body = dto.Body,
                    SenderNickname = dto.SenderNickname,
                    SenderDiscriminator = dto.SenderDiscriminator,
                    PlayerPublicId = dto.PlayerPublicId,
                    PlatformUserPublicId = dto.PlatformUserPublicId,
                    SenderAvatarUrl = dto.SenderAvatarUrl,
                    GuildPublicId = dto.GuildPublicId,
                    GuildName = dto.GuildName,
                    GuildDiscriminator = dto.GuildDiscriminator,
                    CreationDate = dto.CreationDate,
                },
            },
            ct);

        return dto;
    }

    /// <summary>
    /// Server and role stamped on the ad so the board can filter without walking back to the author:
    /// taken from the guild leader for a recruitment ad, from the author's main character otherwise.
    /// Both stay null when the author has no character yet, which only hides the ad from filtered
    /// searches.
    /// </summary>
    private async Task<(int? IdServer, int? IdDirection)> ResolveScopeAsync(
        int idPlayer,
        Guild? guild,
        CancellationToken ct)
    {
        if (guild is not null)
        {
            var leader = await _context.Characters.AsNoTracking()
                .Where(c => c.Id == guild.IdLeader)
                .Select(c => new { c.IdServer })
                .FirstOrDefaultAsync(ct);

            return (leader?.IdServer, guild.IdMainDirection);
        }

        var character = await _context.Characters.AsNoTracking()
            .Where(c => c.IdPlayer == idPlayer)
            .OrderByDescending(c => c.Main)
            .ThenByDescending(c => c.Level)
            .Select(c => new { c.IdServer, c.IdDirection })
            .FirstOrDefaultAsync(ct);

        return (character?.IdServer, character?.IdDirection);
    }

    private async Task<Player> GetOrCreatePlayerAsync(BusMessage message, CreateLfgAdRequest request, CancellationToken ct)
    {
        var idKeycloak = CallerAuth.RequireKeycloakId(message);
        var player = await _context.Players.FirstOrDefaultAsync(p => p.IdKeycloak == idKeycloak, ct);
        var hasPlatformIdentity = request.PlatformUserId > 0 && request.PlatformUserPublicId != Guid.Empty;

        if (player is null)
        {
            var now = DateTime.UtcNow;
            player = new Player
            {
                PublicId = Guid.NewGuid(),
                IdKeycloak = idKeycloak,
                IdUser = hasPlatformIdentity ? request.PlatformUserId : 0,
                PlatformUserPublicId = hasPlatformIdentity ? request.PlatformUserPublicId : null,
                CreationDate = now,
                ModificationDate = now,
            };
            await _context.Players.AddAsync(player, ct);
            await _context.SaveChangesAsync(ct);
        }
        else if (hasPlatformIdentity &&
                 (player.PlatformUserPublicId != request.PlatformUserPublicId || player.IdUser != request.PlatformUserId))
        {
            player.PlatformUserPublicId = request.PlatformUserPublicId;
            player.IdUser = request.PlatformUserId;
            player.ModificationDate = DateTime.UtcNow;
            await _context.SaveChangesAsync(ct);
        }

        return player;
    }

    /// <summary>
    /// Membership is held per character, so a player may post for a guild as soon as one of their
    /// characters holds a rank allowed to do so there.
    /// </summary>
    private async Task<Guild> RequirePostableGuildAsync(int idPlayer, Guid guildPublicId, CancellationToken ct)
    {
        var guild = await _context.Guilds.FirstOrDefaultAsync(g => g.PublicId == guildPublicId, ct)
            ?? throw new NotFoundException("GUILD_NOT_FOUND", "Guild not found");

        var allowed = await _context.GuildMembers.AsNoTracking()
            .AnyAsync(
                m => m.IdGuild == guild.Id
                     && m.IdCharacterNavigation.IdPlayer == idPlayer
                     && GuildRankCodes.CanPostAsGuild.Contains(m.IdGuildRankNavigation.Entitled),
                ct);

        if (!allowed)
            throw new ForbiddenException("GUILD_RANK_REQUIRED", "Officer rank required to post for this guild");

        return guild;
    }

    /// <summary>
    /// Guild ads share a single cooldown so two officers cannot alternate to bypass it, while
    /// personal ads stay throttled per author.
    /// </summary>
    private async Task EnsureNotInCooldownAsync(int idPlayer, int? idGuild, DateTime postedAt, CancellationToken ct)
    {
        var scope = _context.LfgAds.AsNoTracking();
        scope = idGuild is { } guildId
            ? scope.Where(ad => ad.IdGuild == guildId)
            : scope.Where(ad => ad.IdPlayer == idPlayer && ad.IdGuild == null);

        var lastPostAt = await scope
            .OrderByDescending(ad => ad.CreationDate)
            .Select(ad => ad.CreationDate)
            .FirstOrDefaultAsync(ct);

        if (lastPostAt != default && postedAt - lastPostAt < PostCooldown)
            throw new BadRequestException("COOLDOWN", "Please wait before posting another LFG message");
    }
}
