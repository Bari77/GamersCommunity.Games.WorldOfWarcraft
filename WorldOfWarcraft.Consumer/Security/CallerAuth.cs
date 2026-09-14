using GamersCommunity.Core.Exceptions;
using GamersCommunity.Core.Rabbit;
using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Consumer.Security;

public static class CallerAuth
{
    public static async Task<Player> RequirePlayerAsync(
        WorldOfWarcraftDbContext context,
        BusMessage message,
        CancellationToken ct)
    {
        if (message.Caller?.Subject is not { } subject || !Guid.TryParse(subject, out var idKeycloak))
            throw new UnauthorizedException("UNAUTHORIZED", "Authenticated caller required");

        return await context.Players.FirstOrDefaultAsync(p => p.IdKeycloak == idKeycloak, ct)
            ?? throw new UnauthorizedException("UNAUTHORIZED", "WoW player sheet not initialized");
    }

    /// <summary>
    /// Player id of the caller when they have a WoW sheet, null for anonymous visitors. Used by the
    /// public reads, which must not fail just because nobody is logged in.
    /// </summary>
    public static async Task<int?> FindPlayerIdAsync(
        WorldOfWarcraftDbContext context,
        BusMessage message,
        CancellationToken ct)
    {
        if (message.Caller?.Subject is not { } subject || !Guid.TryParse(subject, out var idKeycloak))
            return null;

        return await context.Players.AsNoTracking()
            .Where(p => p.IdKeycloak == idKeycloak)
            .Select(p => (int?)p.Id)
            .FirstOrDefaultAsync(ct);
    }

    /// <summary>
    /// Platform identity of the caller when they have a WoW sheet, null otherwise. Lets a public
    /// read compare a visitor with the owner of the sheet, or with their friends.
    /// </summary>
    public static async Task<Guid?> FindPlatformUserPublicIdAsync(
        WorldOfWarcraftDbContext context,
        BusMessage message,
        CancellationToken ct)
    {
        if (message.Caller?.Subject is not { } subject || !Guid.TryParse(subject, out var idKeycloak))
            return null;

        return await context.Players.AsNoTracking()
            .Where(p => p.IdKeycloak == idKeycloak)
            .Select(p => p.PlatformUserPublicId)
            .FirstOrDefaultAsync(ct);
    }

    public static Guid RequireKeycloakId(BusMessage message)
    {
        if (message.Caller?.Subject is not { } subject || !Guid.TryParse(subject, out var idKeycloak))
            throw new UnauthorizedException("UNAUTHORIZED", "Authenticated caller required");

        return idKeycloak;
    }
}
