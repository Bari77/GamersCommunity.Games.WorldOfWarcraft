using GamersCommunity.Core.Enums;
using GamersCommunity.Core.Exceptions;
using GamersCommunity.Core.Html;
using GamersCommunity.Core.Rabbit;
using GamersCommunity.Core.Serialization;
using GamersCommunity.Core.Services;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using WorldOfWarcraft.Consumer.Models;
using WorldOfWarcraft.Consumer.Security;
using WorldOfWarcraft.Consumer.Workspace;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Consumer.Services.Data;

public class GuildsService(WorldOfWarcraftDbContext context) : IBusService
{
    private const int MaxSearchTake = 50;

    /// <summary>Cap of the in-game guild progression, kept loose so an expansion needs no release.</summary>
    private const int MaxGuildLevel = 100;

    private const int MaxLayoutLength = 32000;

    /// <summary>Highest crest part shipped in <c>public/wow-crests</c>.</summary>
    private const int MaxCrestEmblem = 195;

    private const int MaxCrestBorder = 6;

    private readonly WorldOfWarcraftDbContext _context = context;

    BusServiceTypeEnum IBusService.Type => BusServiceTypeEnum.DATA;
    public string Resource => "Guilds";

    public async Task<string> HandleAsync(BusMessage message, CancellationToken ct = default)
    {
        switch (message.Action)
        {
            case "Get":
                return JsonSafe.Serialize(await GetSheetAsync(message, ct));

            case "Search":
                return JsonSafe.Serialize(await SearchAsync(message, ct));

            case "ListPostable":
                return JsonSafe.Serialize(await ListPostableAsync(message, ct));

            case "Create":
                return JsonSafe.Serialize(await CreateAsync(message, ct));

            case "Update":
                return JsonSafe.Serialize(await UpdateAsync(message, ct));

            case "SetRank":
                return JsonSafe.Serialize(await SetRankAsync(message, ct));

            case "Kick":
                return JsonSafe.Serialize(await KickAsync(message, ct));

            case "Leave":
                return JsonSafe.Serialize(await LeaveAsync(message, ct));

            case "TransferLeadership":
                return JsonSafe.Serialize(await TransferLeadershipAsync(message, ct));

            case "Disband":
                return JsonSafe.Serialize(await DisbandAsync(message, ct));
        }

        throw new InternalServerErrorException("ACTION_NOT_IMPLEMENTED", $"Action {message.Action} not implemented");
    }

    private async Task<GuildSheetDto> GetSheetAsync(BusMessage message, CancellationToken ct)
    {
        var publicId = ResolveGuildPublicId(message);

        var guild = await _context.Guilds.AsNoTracking()
            .Where(g => g.PublicId == publicId)
            .Select(g => new
            {
                g.Id,
                g.PublicId,
                g.Entitled,
                g.Discriminator,
                g.Level,
                g.Sentence,
                g.LayoutJson,
                ServerName = g.IdLeaderNavigation.IdServerNavigation.Entitled,
                OrientationName = g.IdOrientationNavigation.Entitled,
                Crest = new GuildCrestDto
                {
                    Emblem = g.CrestEmblem,
                    EmblemColor = g.CrestEmblemColor,
                    Border = g.CrestBorder,
                    BorderColor = g.CrestBorderColor,
                    BackgroundColor = g.CrestBackgroundColor,
                    Faction = g.IdLeaderNavigation.IdAlignmentNavigation != null
                        ? g.IdLeaderNavigation.IdAlignmentNavigation.Entitled
                        : null,
                },
                g.CreationDate,
                MemberCount = g.GuildMembers.Count,
            })
            .FirstOrDefaultAsync(ct)
            ?? throw new NotFoundException("GUILD_NOT_FOUND", "Guild not found");

        // The sheet is public, so an anonymous visitor simply gets no viewer-specific section.
        var viewer = await CallerAuth.FindPlayerIdAsync(_context, message, ct);
        var standing = viewer is { } playerId
            ? await GuildAuth.FindStandingAsync(_context, guild.Id, playerId, ct)
            : null;

        var application = viewer is { } candidateId
            ? await _context.GuildApplications.AsNoTracking()
                .Where(a => a.IdGuild == guild.Id && a.IdCharacterNavigation.IdPlayer == candidateId)
                .OrderByDescending(a => a.CreationDate)
                .Select(a => new { a.PublicId, Status = a.IdStatusNavigation.Entitled })
                .FirstOrDefaultAsync(ct)
            : null;

        var moderates = GuildAuth.CanModerate(standing?.Rank);

        return new GuildSheetDto
        {
            PublicId = guild.PublicId,
            Entitled = guild.Entitled,
            Discriminator = guild.Discriminator,
            Level = guild.Level,
            Sentence = guild.Sentence,
            LayoutJson = FilterPages(guild.LayoutJson, standing?.Rank),
            ServerName = guild.ServerName,
            OrientationName = guild.OrientationName,
            Crest = guild.Crest,
            CreationDate = guild.CreationDate,
            MemberCount = guild.MemberCount,
            Members = await ListMembersAsync(guild.Id, ct),
            ViewerRank = standing?.Rank,
            ViewerApplicationStatus = application?.Status,
            ViewerApplicationPublicId = application?.PublicId,
            PendingApplicationCount = moderates
                ? await _context.GuildApplications.CountAsync(
                    a => a.IdGuild == guild.Id
                         && a.IdStatusNavigation.Entitled == GuildApplicationStatusCodes.Pending,
                    ct)
                : 0,
            PendingPostCount = moderates
                ? await _context.GamePosts.CountAsync(
                    p => p.IdGuild == guild.Id
                         && p.IdStatusNavigation.Entitled == GamePostStatusCodes.Pending,
                    ct)
                : 0,
        };
    }

    /// <summary>
    /// Drops the pages the visitor's rank does not reach. A page without a visibility, or marked
    /// public, is open to everyone; the others name the lowest rank allowed to open them.
    /// </summary>
    private static string? FilterPages(string? layoutJson, string? viewerRank)
    {
        var weight = GuildAuth.Weight(viewerRank);

        return WorkspaceVisibility.Filter(
            layoutJson,
            visibility => visibility is null
                          || visibility == GamePostVisibilityCodes.Public
                          || weight >= GuildAuth.Weight(visibility));
    }

    private async Task<List<GuildMemberDto>> ListMembersAsync(int guildId, CancellationToken ct) =>
        await _context.GuildMembers.AsNoTracking()
            .Where(m => m.IdGuild == guildId)
            .OrderBy(m => m.IdGuildRank)
            .ThenBy(m => m.IdCharacterNavigation.Pseudo)
            .Select(m => new GuildMemberDto
            {
                CharacterPublicId = m.IdCharacterNavigation.PublicId,
                Pseudo = m.IdCharacterNavigation.Pseudo,
                Level = m.IdCharacterNavigation.Level,
                Ilvl = m.IdCharacterNavigation.Ilvl,
                ClassName = m.IdCharacterNavigation.IdMainSpecializationClassNavigation != null
                    ? m.IdCharacterNavigation.IdMainSpecializationClassNavigation.IdClassNavigation.Entitled
                    : "",
                MainSpecializationName = m.IdCharacterNavigation.IdMainSpecializationClassNavigation != null
                    ? m.IdCharacterNavigation.IdMainSpecializationClassNavigation.IdSpecializationNavigation.Entitled
                    : null,
                RaceName = m.IdCharacterNavigation.IdRaceNavigation.Entitled,
                DirectionName = m.IdCharacterNavigation.IdDirectionNavigation.Entitled,
                Rank = m.IdGuildRankNavigation.Entitled,
                PlayerPublicId = m.IdCharacterNavigation.IdPlayerNavigation.PublicId,
                PlatformUserPublicId = m.IdCharacterNavigation.IdPlayerNavigation.PlatformUserPublicId ?? Guid.Empty,
                Nickname = _context.PlatformUserSnapshots
                    .Where(s => (Guid?)s.PlatformUserPublicId == m.IdCharacterNavigation.IdPlayerNavigation.PlatformUserPublicId)
                    .Select(s => s.Nickname)
                    .FirstOrDefault() ?? "Player",
                Discriminator = _context.PlatformUserSnapshots
                    .Where(s => (Guid?)s.PlatformUserPublicId == m.IdCharacterNavigation.IdPlayerNavigation.PlatformUserPublicId)
                    .Select(s => s.Discriminator)
                    .FirstOrDefault() ?? "0000",
                AvatarUrl = _context.PlatformUserSnapshots
                    .Where(s => (Guid?)s.PlatformUserPublicId == m.IdCharacterNavigation.IdPlayerNavigation.PlatformUserPublicId)
                    .Select(s => s.AvatarUrl)
                    .FirstOrDefault() ?? "",
                JoinedAt = m.CreationDate,
            })
            .ToListAsync(ct);

    /// <summary>
    /// Guild directory, ordered newest first so the cursor can page on creation date. Server and
    /// faction come from the leader character, like everywhere else on a guild sheet.
    /// </summary>
    private async Task<GuildSearchResultDto> SearchAsync(BusMessage message, CancellationToken ct)
    {
        var request = string.IsNullOrWhiteSpace(message.Data)
            ? new GuildSearchRequest()
            : ConsumerParamParser.ToObject<GuildSearchRequest>(message.Data);

        var take = request.Take is > 0 and <= MaxSearchTake ? request.Take : 20;
        var query = _context.Guilds.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.Query))
        {
            var (name, discriminator) = SearchHandle.Split(request.Query);
            query = query.Where(g => g.Entitled.Contains(name));
            if (discriminator is not null)
                query = query.Where(g => g.Discriminator == discriminator);
        }

        if (request.IdServer is { } idServer)
            query = query.Where(g => g.IdLeaderNavigation.IdServer == idServer);

        if (request.IdAlignment is { } idAlignment)
            query = query.Where(g => g.IdLeaderNavigation.IdAlignment == idAlignment);

        if (request.BeforePublicId is { } beforePublicId && request.BeforeCreationDate is { } beforeDate)
        {
            query = query.Where(g =>
                g.CreationDate < beforeDate
                || (g.CreationDate == beforeDate && g.PublicId.CompareTo(beforePublicId) < 0));
        }

        // One extra row tells the client whether another page exists, without a second count query.
        var rows = await query
            .OrderByDescending(g => g.CreationDate)
            .ThenByDescending(g => g.PublicId)
            .Take(take + 1)
            .Select(g => new GuildSummaryDto
            {
                PublicId = g.PublicId,
                Entitled = g.Entitled,
                Discriminator = g.Discriminator,
                Level = g.Level,
                CreationDate = g.CreationDate,
                ServerName = g.IdLeaderNavigation.IdServerNavigation.Entitled,
                MemberCount = g.GuildMembers.Count,
                Sentence = g.Sentence,
                AlignmentName = g.IdLeaderNavigation.IdAlignmentNavigation != null
                    ? g.IdLeaderNavigation.IdAlignmentNavigation.Entitled
                    : null,
                OrientationName = g.IdOrientationNavigation.Entitled,
                Crest = new GuildCrestDto
                {
                    Emblem = g.CrestEmblem,
                    EmblemColor = g.CrestEmblemColor,
                    Border = g.CrestBorder,
                    BorderColor = g.CrestBorderColor,
                    BackgroundColor = g.CrestBackgroundColor,
                    Faction = g.IdLeaderNavigation.IdAlignmentNavigation != null
                        ? g.IdLeaderNavigation.IdAlignmentNavigation.Entitled
                        : null,
                },
            })
            .ToListAsync(ct);

        var hasMore = rows.Count > take;
        if (hasMore)
            rows.RemoveAt(rows.Count - 1);

        return new GuildSearchResultDto { Items = rows, HasMore = hasMore };
    }

    /// <summary>
    /// Guilds the caller may publish a recruitment ad for, through any of their characters.
    /// Drives the guild picker: the chat stays disabled until one of them is selected.
    /// </summary>
    private async Task<List<PostableGuildDto>> ListPostableAsync(BusMessage message, CancellationToken ct)
    {
        var idKeycloak = CallerAuth.RequireKeycloakId(message);

        return await _context.GuildMembers.AsNoTracking()
            .Where(m => m.IdCharacterNavigation.IdPlayerNavigation.IdKeycloak == idKeycloak
                        && GuildRankCodes.CanPostAsGuild.Contains(m.IdGuildRankNavigation.Entitled))
            .Select(m => new PostableGuildDto
            {
                PublicId = m.IdGuildNavigation.PublicId,
                Entitled = m.IdGuildNavigation.Entitled,
                Discriminator = m.IdGuildNavigation.Discriminator,
                Rank = m.IdGuildRankNavigation.Entitled,
            })
            .Distinct()
            .OrderBy(g => g.Entitled)
            .ThenBy(g => g.Discriminator)
            .ToListAsync(ct);
    }

    private async Task<GuildSheetDto> CreateAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<GuildCreateRequest>(message.Data);
        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);

        var entitled = (request.Entitled ?? "").Trim();
        if (entitled.Length is < 3 or > 50)
            throw new BadRequestException("VALIDATION", "Guild name must be between 3 and 50 characters");

        var founder = await _context.Characters
            .FirstOrDefaultAsync(c => c.PublicId == request.FounderCharacterPublicId, ct)
            ?? throw new NotFoundException("CHARACTER_NOT_FOUND", "Founding character not found");

        if (founder.IdPlayer != caller.Id)
            throw new ForbiddenException("FORBIDDEN", "Cannot found a guild with another player's character");

        if (await _context.GuildMembers.AnyAsync(m => m.IdCharacter == founder.Id, ct))
            throw new BadRequestException("CHARACTER_ALREADY_GUILDED", "This character already belongs to a guild");

        var now = DateTime.UtcNow;
        var guild = new Guild
        {
            PublicId = Guid.NewGuid(),
            Entitled = entitled,
            Discriminator = await AllocateDiscriminatorAsync(entitled, ct),
            Level = 1,
            Sentence = Normalize(request.Sentence),
            IdLeader = founder.Id,
            IdOrientation = await ResolveOrientationIdAsync(request.Orientation ?? GuildOrientationCodes.Default, ct),
            CrestEmblem = GuildCrestDefaults.Emblem,
            CrestEmblemColor = GuildCrestDefaults.EmblemColor,
            CrestBorder = GuildCrestDefaults.Border,
            CrestBorderColor = GuildCrestDefaults.BorderColor,
            CrestBackgroundColor = GuildCrestDefaults.BackgroundColor,
            CreationDate = now,
            ModificationDate = now,
        };

        await _context.Guilds.AddAsync(guild, ct);
        await _context.SaveChangesAsync(ct);

        await _context.GuildMembers.AddAsync(
            new GuildMember
            {
                PublicId = Guid.NewGuid(),
                IdGuild = guild.Id,
                IdCharacter = founder.Id,
                IdGuildRank = await GuildAuth.RequireRankIdAsync(_context, GuildRankCodes.Leader, ct),
                CreationDate = now,
                ModificationDate = now,
            },
            ct);
        await _context.SaveChangesAsync(ct);

        return await GetSheetAsync(GuildMessageFor(message, guild.PublicId), ct);
    }

    private async Task<GuildSheetDto> UpdateAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var publicId = ResolveGuildPublicId(message);
        var request = ConsumerParamParser.ToObject<GuildUpdateRequest>(message.Data);
        var sent = RequestPayload.SentFields(message.Data);

        var guild = await RequireGuildAsync(publicId, ct);
        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        await GuildAuth.RequireStandingAsync(_context, guild.Id, caller.Id, GuildRankCodes.Officer, ct);

        // Optional columns officers may want emptied: only their presence in the payload tells
        // "erase this" apart from "the client did not send it".
        if (sent.Contains(nameof(GuildUpdateRequest.Sentence)))
            guild.Sentence = Normalize(request.Sentence);
        if (sent.Contains(nameof(GuildUpdateRequest.Level)))
            guild.Level = ValidateLevel(request.Level);
        if (sent.Contains(nameof(GuildUpdateRequest.Orientation)))
            guild.IdOrientation = await ResolveOrientationIdAsync(request.Orientation, ct);
        if (sent.Contains(nameof(GuildUpdateRequest.Crest)))
            ApplyCrest(guild, request.Crest);

        // The page is the leader's own: officers stop at the settings above.
        if (sent.Contains(nameof(GuildUpdateRequest.LayoutJson)))
        {
            await GuildAuth.RequireStandingAsync(_context, guild.Id, caller.Id, GuildRankCodes.Leader, ct);
            guild.LayoutJson = NormalizeLayout(request.LayoutJson);
        }

        guild.ModificationDate = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);

        return await GetSheetAsync(GuildMessageFor(message, guild.PublicId), ct);
    }

    private async Task<GuildSheetDto> SetRankAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<GuildSetRankRequest>(message.Data);
        var rank = (request.Rank ?? "").Trim().ToLowerInvariant();
        if (rank is not (GuildRankCodes.Officer or GuildRankCodes.Member))
            throw new BadRequestException("VALIDATION", "Rank must be 'officer' or 'member'; use TransferLeadership for the lead");

        var guild = await RequireGuildAsync(request.GuildPublicId, ct);
        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        await GuildAuth.RequireStandingAsync(_context, guild.Id, caller.Id, GuildRankCodes.Leader, ct);

        var membership = await RequireMembershipAsync(guild.Id, request.CharacterPublicId, ct);
        if (membership.IdCharacter == guild.IdLeader)
            throw new BadRequestException("CANNOT_DEMOTE_LEADER", "Transfer leadership before changing the leader's rank");

        membership.IdGuildRank = await GuildAuth.RequireRankIdAsync(_context, rank, ct);
        membership.ModificationDate = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);

        return await GetSheetAsync(GuildMessageFor(message, guild.PublicId), ct);
    }

    private async Task<GuildSheetDto> KickAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<GuildMemberTargetRequest>(message.Data);
        var guild = await RequireGuildAsync(request.GuildPublicId, ct);
        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        var standing = await GuildAuth.RequireStandingAsync(_context, guild.Id, caller.Id, GuildRankCodes.Officer, ct);

        var membership = await RequireMembershipAsync(guild.Id, request.CharacterPublicId, ct);
        if (membership.IdCharacter == standing.ActingCharacterId)
            throw new BadRequestException("CANNOT_KICK_SELF", "Use Leave to quit a guild");

        var targetRank = await _context.GuildRanks.AsNoTracking()
            .Where(r => r.Id == membership.IdGuildRank)
            .Select(r => r.Entitled)
            .FirstAsync(ct);

        if (GuildAuth.Weight(targetRank) >= GuildAuth.Weight(standing.Rank))
            throw new ForbiddenException("GUILD_RANK_REQUIRED", "Cannot kick a member of equal or higher rank");

        _context.GuildMembers.Remove(membership);
        await _context.SaveChangesAsync(ct);

        return await GetSheetAsync(GuildMessageFor(message, guild.PublicId), ct);
    }

    private async Task<GuildLeaveResult> LeaveAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<GuildMemberTargetRequest>(message.Data);
        var guild = await RequireGuildAsync(request.GuildPublicId, ct);
        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);

        var membership = await RequireMembershipAsync(guild.Id, request.CharacterPublicId, ct);
        var owner = await _context.Characters.AsNoTracking()
            .Where(c => c.Id == membership.IdCharacter)
            .Select(c => c.IdPlayer)
            .FirstAsync(ct);

        if (owner != caller.Id)
            throw new ForbiddenException("FORBIDDEN", "Cannot make another player's character leave");

        if (membership.IdCharacter == guild.IdLeader)
            throw new BadRequestException("LEADER_CANNOT_LEAVE", "Transfer leadership or disband the guild first");

        _context.GuildMembers.Remove(membership);
        await _context.SaveChangesAsync(ct);

        return new GuildLeaveResult { GuildPublicId = guild.PublicId, CharacterPublicId = request.CharacterPublicId };
    }

    private async Task<GuildSheetDto> TransferLeadershipAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<GuildMemberTargetRequest>(message.Data);
        var guild = await RequireGuildAsync(request.GuildPublicId, ct);
        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        await GuildAuth.RequireStandingAsync(_context, guild.Id, caller.Id, GuildRankCodes.Leader, ct);

        var successor = await RequireMembershipAsync(guild.Id, request.CharacterPublicId, ct);
        if (successor.IdCharacter == guild.IdLeader)
            throw new BadRequestException("ALREADY_LEADER", "That character already leads the guild");

        var formerLeader = await _context.GuildMembers
            .FirstOrDefaultAsync(m => m.IdGuild == guild.Id && m.IdCharacter == guild.IdLeader, ct);

        var now = DateTime.UtcNow;
        successor.IdGuildRank = await GuildAuth.RequireRankIdAsync(_context, GuildRankCodes.Leader, ct);
        successor.ModificationDate = now;

        if (formerLeader is not null)
        {
            formerLeader.IdGuildRank = await GuildAuth.RequireRankIdAsync(_context, GuildRankCodes.Officer, ct);
            formerLeader.ModificationDate = now;
        }

        // Guild.IdLeader carries the server and faction shown on the sheet, so it moves with the rank.
        guild.IdLeader = successor.IdCharacter;
        guild.ModificationDate = now;
        await _context.SaveChangesAsync(ct);

        return await GetSheetAsync(GuildMessageFor(message, guild.PublicId), ct);
    }

    /// <summary>
    /// Removes the guild and everything it owns. Guild content has no meaning without its guild, so
    /// recruitment ads and wall posts go with it rather than being left orphaned.
    /// </summary>
    private async Task<GuildDisbandResult> DisbandAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<GuildDisbandRequest>(message.Data);
        var guild = await RequireGuildAsync(request.GuildPublicId, ct);
        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        await GuildAuth.RequireStandingAsync(_context, guild.Id, caller.Id, GuildRankCodes.Leader, ct);

        var handle = $"{guild.Entitled}#{guild.Discriminator}";
        if (!string.Equals((request.Confirmation ?? "").Trim(), handle, StringComparison.Ordinal))
            throw new BadRequestException("CONFIRMATION_MISMATCH", "Type the guild handle to confirm");

        var rosters = await _context.Rosters.Where(r => r.IdGuild == guild.Id).Select(r => r.Id).ToListAsync(ct);

        _context.RosterMembers.RemoveRange(
            await _context.RosterMembers.Where(m => rosters.Contains(m.IdRoster)).ToListAsync(ct));
        _context.Rosters.RemoveRange(await _context.Rosters.Where(r => r.IdGuild == guild.Id).ToListAsync(ct));
        _context.GuildApplications.RemoveRange(
            await _context.GuildApplications.Where(a => a.IdGuild == guild.Id).ToListAsync(ct));
        _context.GamePosts.RemoveRange(await _context.GamePosts.Where(p => p.IdGuild == guild.Id).ToListAsync(ct));
        _context.LfgAds.RemoveRange(await _context.LfgAds.Where(a => a.IdGuild == guild.Id).ToListAsync(ct));
        _context.GuildLinks.RemoveRange(await _context.GuildLinks.Where(l => l.IdGuild == guild.Id).ToListAsync(ct));
        _context.GuildVips.RemoveRange(await _context.GuildVips.Where(v => v.IdGuild == guild.Id).ToListAsync(ct));
        _context.GuildMembers.RemoveRange(
            await _context.GuildMembers.Where(m => m.IdGuild == guild.Id).ToListAsync(ct));

        _context.Guilds.Remove(guild);
        await _context.SaveChangesAsync(ct);

        return new GuildDisbandResult { PublicId = guild.PublicId, Handle = handle };
    }

    private async Task<Guild> RequireGuildAsync(Guid publicId, CancellationToken ct)
    {
        if (publicId == Guid.Empty)
            throw new BadRequestException("VALIDATION", "Guild public id is required");

        return await _context.Guilds.FirstOrDefaultAsync(g => g.PublicId == publicId, ct)
            ?? throw new NotFoundException("GUILD_NOT_FOUND", "Guild not found");
    }

    private async Task<GuildMember> RequireMembershipAsync(int guildId, Guid characterPublicId, CancellationToken ct)
    {
        if (characterPublicId == Guid.Empty)
            throw new BadRequestException("VALIDATION", "Character public id is required");

        return await _context.GuildMembers
                   .FirstOrDefaultAsync(
                       m => m.IdGuild == guildId && m.IdCharacterNavigation.PublicId == characterPublicId,
                       ct)
               ?? throw new NotFoundException("GUILD_MEMBER_NOT_FOUND", "That character is not a member of this guild");
    }

    /// <summary>
    /// Four random digits, retried on collision: the handle only has to be unique per guild name, so
    /// the 10 000 slots are never realistically exhausted.
    /// </summary>
    private async Task<string> AllocateDiscriminatorAsync(string entitled, CancellationToken ct)
    {
        var taken = await _context.Guilds.AsNoTracking()
            .Where(g => g.Entitled == entitled)
            .Select(g => g.Discriminator)
            .ToListAsync(ct);

        if (taken.Count >= 9000)
            throw new BadRequestException("GUILD_NAME_EXHAUSTED", "Too many guilds already use that name");

        string candidate;
        do
        {
            candidate = Random.Shared.Next(1000, 10000).ToString();
        } while (taken.Contains(candidate));

        return candidate;
    }

    /// <summary>
    /// Re-reads the sheet after a write, through the same public path so callers always get the
    /// viewer-specific fields computed for them.
    /// </summary>
    private static BusMessage GuildMessageFor(BusMessage source, Guid guildPublicId) => new()
    {
        Type = source.Type,
        Resource = source.Resource,
        Action = "Get",
        PublicId = guildPublicId,
        Caller = source.Caller,
    };

    private static Guid ResolveGuildPublicId(BusMessage message)
    {
        if (message.PublicId is { } fromRoute && fromRoute != Guid.Empty)
            return fromRoute;

        if (!string.IsNullOrWhiteSpace(message.Data))
        {
            var request = ConsumerParamParser.ToObject<GuildGetRequest>(message.Data);
            if (request.PublicId != Guid.Empty)
                return request.PublicId;
        }

        throw new BadRequestException("VALIDATION", "Guild public id is required");
    }

    private const int MaxSentenceLength = 255;

    private static string? Normalize(string? value)
    {
        var html = RichHtml.SanitizeOptional(value);
        if (html != null && html.Length > MaxSentenceLength)
            throw new BadRequestException("VALIDATION", $"Catchphrase must be at most {MaxSentenceLength} characters");

        return html;
    }

    private static int ValidateLevel(int? level)
    {
        if (level is not { } value || value < 1 || value > MaxGuildLevel)
            throw new BadRequestException("INVALID_LEVEL", $"Guild level must be between 1 and {MaxGuildLevel}");

        return value;
    }

    private async Task<int> ResolveOrientationIdAsync(string? code, CancellationToken ct)
    {
        var entitled = (code ?? "").Trim().ToLowerInvariant();
        if (!GuildOrientationCodes.All.Contains(entitled))
            throw new BadRequestException("INVALID_ORIENTATION", "Orientation must be 'pve', 'pvp' or 'pvpe'");

        var id = await _context.GuildOrientations.AsNoTracking()
            .Where(o => o.Entitled == entitled)
            .Select(o => o.Id)
            .FirstOrDefaultAsync(ct);

        return id != 0
            ? id
            : throw new InternalServerErrorException("ORIENTATION_MISSING", $"Orientation {entitled} is not seeded");
    }

    /// <summary>
    /// The editor always posts the whole crest, so the parts are validated and applied together
    /// rather than one field at a time.
    /// </summary>
    private static void ApplyCrest(Guild guild, GuildCrestUpdate? crest)
    {
        if (crest is null)
            throw new BadRequestException("VALIDATION", "Crest is required");

        guild.CrestEmblem = ValidateCrestPart(crest.Emblem, MaxCrestEmblem, "emblem");
        guild.CrestBorder = ValidateCrestPart(crest.Border, MaxCrestBorder, "border");
        guild.CrestEmblemColor = ValidateColor(crest.EmblemColor);
        guild.CrestBorderColor = ValidateColor(crest.BorderColor);
        guild.CrestBackgroundColor = ValidateColor(crest.BackgroundColor);
    }

    private static int ValidateCrestPart(int index, int max, string part)
    {
        if (index < 0 || index > max)
            throw new BadRequestException("INVALID_CREST", $"Crest {part} must be between 0 and {max}");

        return index;
    }

    /// <summary>
    /// Colours travel as <c>#rrggbb</c> so they can be dropped straight into a stylesheet; anything
    /// else is refused rather than escaped.
    /// </summary>
    private static string ValidateColor(string? value)
    {
        var color = (value ?? "").Trim().ToLowerInvariant();
        if (color.Length != 7 || color[0] != '#' || !color[1..].All(Uri.IsHexDigit))
            throw new BadRequestException("INVALID_CREST", "Crest colours must look like #rrggbb");

        return color;
    }

    /// <summary>
    /// Same contract as the player sheet: the layout is opaque to the back end, which only checks
    /// that it is JSON of a sane size so a corrupt payload cannot break every visitor's page.
    /// </summary>
    private static string? NormalizeLayout(string? layoutJson)
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
}
