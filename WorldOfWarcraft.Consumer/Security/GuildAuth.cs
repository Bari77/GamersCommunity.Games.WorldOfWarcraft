using GamersCommunity.Core.Exceptions;
using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Consumer.Security;

/// <summary>
/// Guild permissions, derived from <see cref="GuildMember"/> which is the single source of truth for
/// who may act on a guild.
/// </summary>
public static class GuildAuth
{
    /// <summary>
    /// Best rank a player holds in a guild, together with the character carrying it. That character
    /// is the one recorded as reviewer or moderator, so officer actions stay attributable.
    /// </summary>
    public sealed record GuildStanding(string Rank, int ActingCharacterId);

    public static int Weight(string? rank) => rank switch
    {
        GuildRankCodes.Leader => 3,
        GuildRankCodes.Officer => 2,
        GuildRankCodes.Member => 1,
        _ => 0,
    };

    public static bool CanModerate(string? rank) => Weight(rank) >= Weight(GuildRankCodes.Officer);

    /// <summary>
    /// A player can hold several ranks in the same guild through different characters; only the
    /// highest one matters for permissions.
    /// </summary>
    public static async Task<GuildStanding?> FindStandingAsync(
        WorldOfWarcraftDbContext context,
        int guildId,
        int playerId,
        CancellationToken ct)
    {
        var memberships = await context.GuildMembers.AsNoTracking()
            .Where(m => m.IdGuild == guildId && m.IdCharacterNavigation.IdPlayer == playerId)
            .Select(m => new { m.IdCharacter, Rank = m.IdGuildRankNavigation.Entitled })
            .ToListAsync(ct);

        return memberships
            .OrderByDescending(m => Weight(m.Rank))
            .Select(m => new GuildStanding(m.Rank, m.IdCharacter))
            .FirstOrDefault();
    }

    public static async Task<GuildStanding> RequireStandingAsync(
        WorldOfWarcraftDbContext context,
        int guildId,
        int playerId,
        string minimumRank,
        CancellationToken ct)
    {
        var standing = await FindStandingAsync(context, guildId, playerId, ct)
            ?? throw new ForbiddenException("GUILD_MEMBER_REQUIRED", "You are not a member of this guild");

        if (Weight(standing.Rank) < Weight(minimumRank))
            throw new ForbiddenException("GUILD_RANK_REQUIRED", $"Rank '{minimumRank}' or above is required");

        return standing;
    }

    public static async Task<int> RequireRankIdAsync(
        WorldOfWarcraftDbContext context,
        string rank,
        CancellationToken ct) =>
        await context.GuildRanks.AsNoTracking()
            .Where(r => r.Entitled == rank)
            .Select(r => r.Id)
            .FirstOrDefaultAsync(ct) is var id && id != 0
            ? id
            : throw new InternalServerErrorException("GUILD_RANK_MISSING", $"Guild rank '{rank}' is not seeded");
}
