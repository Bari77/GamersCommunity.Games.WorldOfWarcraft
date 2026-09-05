using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Database.Seed;

public sealed class ClassesSeed : KeyTableSeed<WorldOfWarcraftDbContext, Class>
{
    protected override string TableName => nameof(WorldOfWarcraftDbContext.Classes);

    protected override DbSet<Class> GetSet(WorldOfWarcraftDbContext db) => db.Classes;

    protected override IReadOnlyList<Class> Rows { get; } =
    [
        new() { Id = 1, Entitled = "warrior", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 2, Entitled = "paladin", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 3, Entitled = "hunter", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 4, Entitled = "rogue", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 5, Entitled = "priest", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 6, Entitled = "shaman", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 7, Entitled = "mage", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 8, Entitled = "warlock", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 9, Entitled = "monk", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 10, Entitled = "druid", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 11, Entitled = "demon_hunter", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 12, Entitled = "death_knight", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 13, Entitled = "evoker", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
    ];
}
