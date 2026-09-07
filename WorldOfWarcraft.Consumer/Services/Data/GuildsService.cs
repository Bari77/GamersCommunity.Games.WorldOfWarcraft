using GamersCommunity.Core.Enums;
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

public class GuildsService(WorldOfWarcraftDbContext context) : IBusService
{
    private readonly WorldOfWarcraftDbContext _context = context;

    BusServiceTypeEnum IBusService.Type => BusServiceTypeEnum.DATA;
    public string Resource => "Guilds";

    public async Task<string> HandleAsync(BusMessage message, CancellationToken ct = default)
    {
        switch (message.Action)
        {
            case "Get":
                return JsonSafe.Serialize(await GetSheetAsync(message, ct));

            case "ListPostable":
                return JsonSafe.Serialize(await ListPostableAsync(message, ct));
        }

        throw new InternalServerErrorException("ACTION_NOT_IMPLEMENTED", $"Action {message.Action} not implemented");
    }

    private async Task<GuildSheetDto> GetSheetAsync(BusMessage message, CancellationToken ct)
    {
        var publicId = ResolveGuildPublicId(message);

        var sheet = await _context.Guilds.AsNoTracking()
            .Where(g => g.PublicId == publicId)
            .Select(g => new GuildSheetDto
            {
                PublicId = g.PublicId,
                Entitled = g.Entitled,
                Discriminator = g.Discriminator,
                Level = g.Level,
                Sentence = g.Sentence,
                LinkDiscord = g.LinkDiscord,
                LinkForum = g.LinkForum,
                ServerName = g.IdLeaderNavigation.IdServerNavigation.Entitled,
                DirectionName = g.IdMainDirectionNavigation.Entitled,
                CreationDate = g.CreationDate,
            })
            .FirstOrDefaultAsync(ct)
            ?? throw new NotFoundException("GUILD_NOT_FOUND", "Guild not found");

        return new GuildSheetDto
        {
            PublicId = sheet.PublicId,
            Entitled = sheet.Entitled,
            Discriminator = sheet.Discriminator,
            Level = sheet.Level,
            Sentence = sheet.Sentence,
            LinkDiscord = sheet.LinkDiscord,
            LinkForum = sheet.LinkForum,
            ServerName = sheet.ServerName,
            DirectionName = sheet.DirectionName,
            CreationDate = sheet.CreationDate,
            Members = await ListMembersAsync(publicId, ct),
        };
    }

    private async Task<List<GuildMemberDto>> ListMembersAsync(Guid guildPublicId, CancellationToken ct) =>
        await _context.GuildMembers.AsNoTracking()
            .Where(m => m.IdGuildNavigation.PublicId == guildPublicId)
            .OrderBy(m => m.IdGuildRank)
            .ThenBy(m => m.IdCharacterNavigation.Pseudo)
            .Select(m => new GuildMemberDto
            {
                CharacterPublicId = m.IdCharacterNavigation.PublicId,
                Pseudo = m.IdCharacterNavigation.Pseudo,
                Level = m.IdCharacterNavigation.Level,
                ClassName = m.IdCharacterNavigation.IdMainSpecializationClassNavigation != null
                    ? m.IdCharacterNavigation.IdMainSpecializationClassNavigation.IdClassNavigation.Entitled
                    : "",
                RaceName = m.IdCharacterNavigation.IdRaceNavigation.Entitled,
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
            })
            .ToListAsync(ct);

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
}
