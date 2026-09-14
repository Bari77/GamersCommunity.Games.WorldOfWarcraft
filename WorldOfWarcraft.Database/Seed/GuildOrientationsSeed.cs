using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Database.Seed;

public sealed class GuildOrientationsSeed : KeyTableSeed<WorldOfWarcraftDbContext, GuildOrientation>
{
    protected override string TableName => nameof(WorldOfWarcraftDbContext.GuildOrientations);

    protected override DbSet<GuildOrientation> GetSet(WorldOfWarcraftDbContext db) => db.GuildOrientations;

    protected override IReadOnlyList<GuildOrientation> Rows { get; } =
    [
        new() { Id = 1, Entitled = GuildOrientationCodes.Pve, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 2, Entitled = GuildOrientationCodes.Pvp, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 3, Entitled = GuildOrientationCodes.Pvpe, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
    ];
}
