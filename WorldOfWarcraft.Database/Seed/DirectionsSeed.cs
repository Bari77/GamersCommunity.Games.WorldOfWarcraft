using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Database.Seed;

public sealed class DirectionsSeed : KeyTableSeed<WorldOfWarcraftDbContext, Direction>
{
    protected override string TableName => nameof(WorldOfWarcraftDbContext.Directions);

    protected override DbSet<Direction> GetSet(WorldOfWarcraftDbContext db) => db.Directions;

    protected override IReadOnlyList<Direction> Rows { get; } =
    [
        new() { Id = 1, Entitled = "tank", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 2, Entitled = "heal", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 3, Entitled = "dps", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
    ];
}
