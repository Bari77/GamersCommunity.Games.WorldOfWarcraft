using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Database.Seed;

public sealed class SpecializationsSeed : KeyTableSeed<WorldOfWarcraftDbContext, Specialization>
{
    protected override string TableName => nameof(WorldOfWarcraftDbContext.Specializations);

    protected override DbSet<Specialization> GetSet(WorldOfWarcraftDbContext db) => db.Specializations;

    protected override IReadOnlyList<Specialization> Rows { get; } =
    [
        new() { Id = 1, Entitled = "arms", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 2, Entitled = "fury", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 3, Entitled = "protection", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 4, Entitled = "holy", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 5, Entitled = "retribution", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 6, Entitled = "discipline", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 7, Entitled = "shadow", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
    ];
}
