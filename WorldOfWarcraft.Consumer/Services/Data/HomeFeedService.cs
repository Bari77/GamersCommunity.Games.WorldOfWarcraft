using GamersCommunity.Core.Enums;
using GamersCommunity.Core.Exceptions;
using GamersCommunity.Core.Rabbit;
using GamersCommunity.Core.Serialization;
using GamersCommunity.Core.Services;
using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Consumer.Models;
using WorldOfWarcraft.Database.Context;

namespace WorldOfWarcraft.Consumer.Services.Data;

public class HomeFeedService(WorldOfWarcraftDbContext context) : IBusService
{
    private const int FeedTake = 5;
    private readonly WorldOfWarcraftDbContext _context = context;

    BusServiceTypeEnum IBusService.Type => BusServiceTypeEnum.DATA;
    public string Resource => "HomeFeed";

    public async Task<string> HandleAsync(BusMessage message, CancellationToken ct = default)
    {
        if (!message.Action.Equals("Get", StringComparison.OrdinalIgnoreCase))
            throw new InternalServerErrorException("ACTION_NOT_IMPLEMENTED", $"Action {message.Action} not implemented");

        var now = DateTime.UtcNow;

        var latestLfg = await _context.LfgAds.AsNoTracking()
            .Where(ad => ad.IsActive && ad.ExpiresAt > now)
            .OrderByDescending(ad => ad.CreationDate)
            .ThenByDescending(ad => ad.PublicId)
            .Take(FeedTake)
            .Select(ad => new LfgAdSummaryDto
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
            })
            .ToListAsync(ct);
        latestLfg.Reverse();

        var latestCharacters = await _context.Characters.AsNoTracking()
            .OrderByDescending(c => c.CreationDate)
            .Take(FeedTake)
            .Select(c => new CharacterSummaryDto
            {
                PublicId = c.PublicId,
                Pseudo = c.Pseudo,
                Level = c.Level,
                Main = c.Main,
                CreationDate = c.CreationDate,
                PlayerPublicId = c.IdPlayerNavigation.PublicId,
                ServerName = c.IdServerNavigation.Entitled,
                RaceName = c.IdRaceNavigation.Entitled,
            })
            .ToListAsync(ct);

        var latestPlayers = await _context.Players.AsNoTracking()
            .Where(p => p.PlatformUserPublicId != null)
            .OrderByDescending(p => p.CreationDate)
            .Take(FeedTake)
            .Select(p => new PlayerSummaryDto
            {
                PublicId = p.PublicId,
                PlatformUserPublicId = p.PlatformUserPublicId ?? Guid.Empty,
                Nickname = _context.PlatformUserSnapshots
                    .Where(s => s.PlatformUserPublicId == p.PlatformUserPublicId)
                    .Select(s => s.Nickname)
                    .FirstOrDefault() ?? "Player",
                Discriminator = _context.PlatformUserSnapshots
                    .Where(s => s.PlatformUserPublicId == p.PlatformUserPublicId)
                    .Select(s => s.Discriminator)
                    .FirstOrDefault() ?? "0000",
                AvatarUrl = _context.PlatformUserSnapshots
                    .Where(s => s.PlatformUserPublicId == p.PlatformUserPublicId)
                    .Select(s => s.AvatarUrl)
                    .FirstOrDefault() ?? "",
                PresentationIrl = p.PresentationIrl,
                CreationDate = p.CreationDate,
            })
            .ToListAsync(ct);

        var latestGuilds = await _context.Guilds.AsNoTracking()
            .OrderByDescending(g => g.CreationDate)
            .Take(FeedTake)
            .Select(g => new GuildSummaryDto
            {
                PublicId = g.PublicId,
                Entitled = g.Entitled,
                Discriminator = g.Discriminator,
                Level = g.Level,
                CreationDate = g.CreationDate,
                ServerName = g.IdLeaderNavigation.IdServerNavigation.Entitled,
                MemberCount = g.GuildMembers.Count,
            })
            .ToListAsync(ct);

        return JsonSafe.Serialize(new HomeFeedDto
        {
            LatestLfg = latestLfg,
            LatestCharacters = latestCharacters,
            LatestPlayers = latestPlayers,
            LatestGuilds = latestGuilds,
        });
    }
}
