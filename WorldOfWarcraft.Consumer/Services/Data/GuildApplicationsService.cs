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

public class GuildApplicationsService(
    WorldOfWarcraftDbContext context,
    IPlatformSanctionsClient sanctions) : IBusService
{
    private const int MaxMessageLength = 1000;
    private readonly WorldOfWarcraftDbContext _context = context;

    BusServiceTypeEnum IBusService.Type => BusServiceTypeEnum.DATA;
    public string Resource => "GuildApplications";

    public async Task<string> HandleAsync(BusMessage message, CancellationToken ct = default)
    {
        switch (message.Action)
        {
            case "Create":
                return JsonSafe.Serialize(await CreateAsync(message, ct));

            case "ListMine":
                return JsonSafe.Serialize(await ListMineAsync(message, ct));

            case "List":
                return JsonSafe.Serialize(await ListForGuildAsync(message, ct));

            case "Review":
                return JsonSafe.Serialize(await ReviewAsync(message, ct));

            case "Withdraw":
                return JsonSafe.Serialize(await WithdrawAsync(message, ct));
        }

        throw new InternalServerErrorException("ACTION_NOT_IMPLEMENTED", $"Action {message.Action} not implemented");
    }

    private async Task<GuildApplicationDto> CreateAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<GuildApplicationCreateRequest>(message.Data);
        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        await sanctions.EnsureCanPublishAsync(message, ct);

        var text = (request.Message ?? "").Trim();
        if (text.Length == 0)
            throw new BadRequestException("VALIDATION", "An application message is required");
        if (text.Length > MaxMessageLength)
            throw new BadRequestException("MESSAGE_TOO_LONG", $"Message cannot exceed {MaxMessageLength} characters");

        var guild = await _context.Guilds.AsNoTracking()
            .FirstOrDefaultAsync(g => g.PublicId == request.GuildPublicId, ct)
            ?? throw new NotFoundException("GUILD_NOT_FOUND", "Guild not found");

        var character = await _context.Characters.AsNoTracking()
            .FirstOrDefaultAsync(c => c.PublicId == request.CharacterPublicId, ct)
            ?? throw new NotFoundException("CHARACTER_NOT_FOUND", "Character not found");

        if (character.IdPlayer != caller.Id)
            throw new ForbiddenException("FORBIDDEN", "Cannot apply with another player's character");

        if (await _context.GuildMembers.AnyAsync(m => m.IdCharacter == character.Id, ct))
            throw new BadRequestException("CHARACTER_ALREADY_GUILDED", "This character already belongs to a guild");

        var alreadyPending = await _context.GuildApplications.AnyAsync(
            a => a.IdGuild == guild.Id
                 && a.IdCharacter == character.Id
                 && a.IdStatusNavigation.Entitled == GuildApplicationStatusCodes.Pending,
            ct);
        if (alreadyPending)
            throw new BadRequestException("APPLICATION_PENDING", "This character already has a pending application");

        var now = DateTime.UtcNow;
        var application = new GuildApplication
        {
            PublicId = Guid.NewGuid(),
            IdGuild = guild.Id,
            IdCharacter = character.Id,
            Message = text,
            IdStatus = await RequireStatusIdAsync(GuildApplicationStatusCodes.Pending, ct),
            CreationDate = now,
            ModificationDate = now,
        };

        await _context.GuildApplications.AddAsync(application, ct);
        await _context.SaveChangesAsync(ct);

        return await ToDtoAsync(application.Id, ct);
    }

    private async Task<List<GuildApplicationDto>> ListMineAsync(BusMessage message, CancellationToken ct)
    {
        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);

        return await Project(_context.GuildApplications.AsNoTracking()
                .Where(a => a.IdCharacterNavigation.IdPlayer == caller.Id)
                .OrderByDescending(a => a.CreationDate))
            .ToListAsync(ct);
    }

    private async Task<List<GuildApplicationDto>> ListForGuildAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<GuildApplicationListRequest>(message.Data);
        var guild = await _context.Guilds.AsNoTracking()
            .FirstOrDefaultAsync(g => g.PublicId == request.GuildPublicId, ct)
            ?? throw new NotFoundException("GUILD_NOT_FOUND", "Guild not found");

        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        await GuildAuth.RequireStandingAsync(_context, guild.Id, caller.Id, GuildRankCodes.Officer, ct);

        var status = string.IsNullOrWhiteSpace(request.Status)
            ? GuildApplicationStatusCodes.Pending
            : request.Status.Trim().ToLowerInvariant();

        return await Project(_context.GuildApplications.AsNoTracking()
                .Where(a => a.IdGuild == guild.Id && a.IdStatusNavigation.Entitled == status)
                .OrderBy(a => a.CreationDate))
            .ToListAsync(ct);
    }

    /// <summary>
    /// Accepting an application creates the membership; the character is never added twice because
    /// it must be unguilded for the application to have been accepted.
    /// </summary>
    private async Task<GuildApplicationDto> ReviewAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<GuildApplicationReviewRequest>(message.Data);
        var application = await RequirePendingAsync(request.PublicId, ct);

        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        var standing = await GuildAuth.RequireStandingAsync(
            _context, application.IdGuild, caller.Id, GuildRankCodes.Officer, ct);

        var now = DateTime.UtcNow;

        if (request.Accept)
        {
            if (await _context.GuildMembers.AnyAsync(m => m.IdCharacter == application.IdCharacter, ct))
                throw new BadRequestException("CHARACTER_ALREADY_GUILDED", "This character joined a guild in the meantime");

            await _context.GuildMembers.AddAsync(
                new GuildMember
                {
                    PublicId = Guid.NewGuid(),
                    IdGuild = application.IdGuild,
                    IdCharacter = application.IdCharacter,
                    IdGuildRank = await GuildAuth.RequireRankIdAsync(_context, GuildRankCodes.Member, ct),
                    CreationDate = now,
                    ModificationDate = now,
                },
                ct);

            // Pending applications to other guilds become moot once the character is guilded.
            var others = await _context.GuildApplications
                .Where(a => a.IdCharacter == application.IdCharacter
                            && a.Id != application.Id
                            && a.IdStatusNavigation.Entitled == GuildApplicationStatusCodes.Pending)
                .ToListAsync(ct);

            var withdrawnId = await RequireStatusIdAsync(GuildApplicationStatusCodes.Withdrawn, ct);
            foreach (var other in others)
            {
                other.IdStatus = withdrawnId;
                other.ModificationDate = now;
            }
        }

        application.IdStatus = await RequireStatusIdAsync(
            request.Accept ? GuildApplicationStatusCodes.Accepted : GuildApplicationStatusCodes.Rejected,
            ct);
        application.IdReviewer = standing.ActingCharacterId;
        application.ReviewedAt = now;
        application.ModificationDate = now;

        await _context.SaveChangesAsync(ct);

        return await ToDtoAsync(application.Id, ct);
    }

    private async Task<GuildApplicationDto> WithdrawAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<GuildApplicationTargetRequest>(message.Data);
        var application = await RequirePendingAsync(request.PublicId, ct);
        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);

        var owner = await _context.Characters.AsNoTracking()
            .Where(c => c.Id == application.IdCharacter)
            .Select(c => c.IdPlayer)
            .FirstAsync(ct);

        if (owner != caller.Id)
            throw new ForbiddenException("FORBIDDEN", "Cannot withdraw another player's application");

        application.IdStatus = await RequireStatusIdAsync(GuildApplicationStatusCodes.Withdrawn, ct);
        application.ModificationDate = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);

        return await ToDtoAsync(application.Id, ct);
    }

    private async Task<GuildApplication> RequirePendingAsync(Guid publicId, CancellationToken ct)
    {
        if (publicId == Guid.Empty)
            throw new BadRequestException("VALIDATION", "Application public id is required");

        var application = await _context.GuildApplications
            .FirstOrDefaultAsync(a => a.PublicId == publicId, ct)
            ?? throw new NotFoundException("APPLICATION_NOT_FOUND", "Application not found");

        var status = await _context.GuildApplicationStatuses.AsNoTracking()
            .Where(s => s.Id == application.IdStatus)
            .Select(s => s.Entitled)
            .FirstAsync(ct);

        if (status != GuildApplicationStatusCodes.Pending)
            throw new BadRequestException("APPLICATION_CLOSED", "This application has already been handled");

        return application;
    }

    private async Task<int> RequireStatusIdAsync(string code, CancellationToken ct) =>
        await _context.GuildApplicationStatuses.AsNoTracking()
            .Where(s => s.Entitled == code)
            .Select(s => s.Id)
            .FirstOrDefaultAsync(ct) is var id && id != 0
            ? id
            : throw new BadRequestException("INVALID_STATUS", $"Unknown application status '{code}'");

    private IQueryable<GuildApplicationDto> Project(IQueryable<GuildApplication> applications) =>
        applications.Select(a => new GuildApplicationDto
        {
            PublicId = a.PublicId,
            Message = a.Message,
            Status = a.IdStatusNavigation.Entitled,
            CreationDate = a.CreationDate,
            ReviewedAt = a.ReviewedAt,
            GuildPublicId = a.IdGuildNavigation.PublicId,
            GuildName = a.IdGuildNavigation.Entitled,
            GuildDiscriminator = a.IdGuildNavigation.Discriminator,
            CharacterPublicId = a.IdCharacterNavigation.PublicId,
            CharacterPseudo = a.IdCharacterNavigation.Pseudo,
            CharacterLevel = a.IdCharacterNavigation.Level,
            CharacterClassName = a.IdCharacterNavigation.IdMainSpecializationClassNavigation != null
                ? a.IdCharacterNavigation.IdMainSpecializationClassNavigation.IdClassNavigation.Entitled
                : "",
            CharacterRaceName = a.IdCharacterNavigation.IdRaceNavigation.Entitled,
            CharacterServerName = a.IdCharacterNavigation.IdServerNavigation.Entitled,
            PlayerPublicId = a.IdCharacterNavigation.IdPlayerNavigation.PublicId,
            PlatformUserPublicId = a.IdCharacterNavigation.IdPlayerNavigation.PlatformUserPublicId ?? Guid.Empty,
            Nickname = _context.PlatformUserSnapshots
                .Where(s => (Guid?)s.PlatformUserPublicId == a.IdCharacterNavigation.IdPlayerNavigation.PlatformUserPublicId)
                .Select(s => s.Nickname)
                .FirstOrDefault() ?? "Player",
            Discriminator = _context.PlatformUserSnapshots
                .Where(s => (Guid?)s.PlatformUserPublicId == a.IdCharacterNavigation.IdPlayerNavigation.PlatformUserPublicId)
                .Select(s => s.Discriminator)
                .FirstOrDefault() ?? "0000",
            AvatarUrl = _context.PlatformUserSnapshots
                .Where(s => (Guid?)s.PlatformUserPublicId == a.IdCharacterNavigation.IdPlayerNavigation.PlatformUserPublicId)
                .Select(s => s.AvatarUrl)
                .FirstOrDefault() ?? "",
        });

    private async Task<GuildApplicationDto> ToDtoAsync(int applicationId, CancellationToken ct) =>
        await Project(_context.GuildApplications.AsNoTracking().Where(a => a.Id == applicationId))
            .FirstAsync(ct);
}
