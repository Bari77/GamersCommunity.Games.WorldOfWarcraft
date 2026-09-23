using GamersCommunity.Core.Database.Seed;
using Microsoft.Extensions.Logging;
using WorldOfWarcraft.Database.Context;

namespace WorldOfWarcraft.Database.Seed;

public static class ReferenceDataSeed
{
    private static readonly IReadOnlyList<IReferenceTableSeed<WorldOfWarcraftDbContext>> Tables =
        ReferenceTableSeedDiscovery.Discover<WorldOfWarcraftDbContext>(typeof(ReferenceDataSeed).Assembly);

    public static Task EnsureAsync(
        WorldOfWarcraftDbContext db,
        ILogger logger,
        CancellationToken ct = default) =>
        ReferenceDataSeedRunner.EnsureAsync(db, Tables, logger, ct);
}
