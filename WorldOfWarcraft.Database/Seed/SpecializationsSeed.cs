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
        new() { Id = 8, Entitled = "beast_mastery", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 9, Entitled = "marksmanship", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 10, Entitled = "survival", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 11, Entitled = "assassination", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 12, Entitled = "outlaw", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 13, Entitled = "subtlety", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 14, Entitled = "elemental", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 15, Entitled = "enhancement", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 16, Entitled = "restoration", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 17, Entitled = "arcane", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 18, Entitled = "fire", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 19, Entitled = "frost", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 20, Entitled = "affliction", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 21, Entitled = "demonology", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 22, Entitled = "destruction", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 23, Entitled = "brewmaster", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 24, Entitled = "mistweaver", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 25, Entitled = "windwalker", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 26, Entitled = "balance", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 27, Entitled = "feral", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 28, Entitled = "guardian", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 29, Entitled = "havoc", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 30, Entitled = "vengeance", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 31, Entitled = "blood", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 32, Entitled = "unholy", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 33, Entitled = "devastation", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 34, Entitled = "preservation", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 35, Entitled = "augmentation", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
    ];
}
