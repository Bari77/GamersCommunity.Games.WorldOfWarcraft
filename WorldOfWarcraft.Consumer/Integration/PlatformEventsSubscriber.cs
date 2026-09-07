using GamersCommunity.Core.Events;
using GamersCommunity.Core.Rabbit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Serilog;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Consumer.Integration;

/// <summary>
/// Keeps the local <see cref="PlatformUserSnapshot"/> read model in sync with the identities
/// broadcast by the Platform microservice.
/// </summary>
public sealed class PlatformEventsSubscriber(
    IOptions<RabbitMQSettings> opts,
    IServiceScopeFactory scopeFactory,
    ILogger logger) : IntegrationEventSubscriber(opts, logger)
{
    public const string MicroserviceId = "worldofwarcraft";

    protected override string Exchange => IntegrationExchanges.PlatformEvents;

    protected override string Queue => IntegrationQueues.ForMicroservice(IntegrationExchanges.PlatformEvents, MicroserviceId);

    protected override async Task HandleAsync(string type, string json, CancellationToken ct)
    {
        if (!string.Equals(type, IntegrationEventTypes.UserIdentityChanged, StringComparison.OrdinalIgnoreCase))
        {
            // Unknown events are ignored so Platform can introduce new ones without breaking us.
            logger.Debug("Ignoring integration event '{Type}'.", type);
            return;
        }

        var evt = IntegrationEventSerializer.Deserialize<UserIdentityChangedEvent>(json);
        if (evt is null || evt.UserPublicId == Guid.Empty)
        {
            logger.Warning("Invalid '{Type}' payload.", type);
            return;
        }

        using var scope = scopeFactory.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<WorldOfWarcraftDbContext>();

        var snapshot = await context.PlatformUserSnapshots
            .FirstOrDefaultAsync(s => s.PlatformUserPublicId == evt.UserPublicId, ct);

        if (snapshot is null)
        {
            context.PlatformUserSnapshots.Add(new PlatformUserSnapshot
            {
                PlatformUserPublicId = evt.UserPublicId,
                Nickname = evt.Nickname,
                Discriminator = evt.Discriminator,
                AvatarUrl = evt.AvatarUrl,
                UpdatedAt = evt.OccurredAt,
            });
        }
        else if (evt.OccurredAt > snapshot.UpdatedAt)
        {
            snapshot.Nickname = evt.Nickname;
            snapshot.Discriminator = evt.Discriminator;
            snapshot.AvatarUrl = evt.AvatarUrl;
            snapshot.UpdatedAt = evt.OccurredAt;
        }
        else
        {
            return;
        }

        await context.SaveChangesAsync(ct);
    }
}
