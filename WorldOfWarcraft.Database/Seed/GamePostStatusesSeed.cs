using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Database.Seed;

public sealed class GamePostStatusesSeed : KeyTableSeed<WorldOfWarcraftDbContext, GamePostStatus>
{
    public override int Order => 5;

    protected override string TableName => nameof(WorldOfWarcraftDbContext.GamePostStatuses);

    protected override DbSet<GamePostStatus> GetSet(WorldOfWarcraftDbContext db) => db.GamePostStatuses;

    protected override IReadOnlyList<GamePostStatus> Rows { get; } =
    [
        new() { Id = 1, Entitled = "pending", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 2, Entitled = "approved", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 3, Entitled = "rejected", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
    ];
}
