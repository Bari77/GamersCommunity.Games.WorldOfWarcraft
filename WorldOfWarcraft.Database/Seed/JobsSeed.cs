using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Database.Seed;

public sealed class JobsSeed : KeyTableSeed<WorldOfWarcraftDbContext, Job>
{
    protected override string TableName => nameof(WorldOfWarcraftDbContext.Jobs);

    protected override DbSet<Job> GetSet(WorldOfWarcraftDbContext db) => db.Jobs;

    protected override IReadOnlyList<Job> Rows { get; } =
    [
        new() { Id = 1, Entitled = "mining", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 2, Entitled = "herbalism", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 3, Entitled = "skinning", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 4, Entitled = "blacksmithing", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 5, Entitled = "tailoring", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 6, Entitled = "jewelcrafting", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 7, Entitled = "enchanting", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 8, Entitled = "inscription", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 9, Entitled = "engineering", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 10, Entitled = "alchemy", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 11, Entitled = "cooking", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 12, Entitled = "fishing", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
    ];
}
