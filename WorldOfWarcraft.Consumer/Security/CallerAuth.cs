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

    public static Guid RequireKeycloakId(BusMessage message)
    {
        if (message.Caller?.Subject is not { } subject || !Guid.TryParse(subject, out var idKeycloak))
            throw new UnauthorizedException("UNAUTHORIZED", "Authenticated caller required");

        return idKeycloak;
    }
}
