using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Database.Seed;

public sealed class RacesSeed : KeyTableSeed<WorldOfWarcraftDbContext, Race>
{
    protected override string TableName => nameof(WorldOfWarcraftDbContext.Races);

    protected override DbSet<Race> GetSet(WorldOfWarcraftDbContext db) => db.Races;

    protected override IReadOnlyList<Race> Rows { get; } =
    [
        new() { Id = 1, Entitled = "human", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 2, Entitled = "orc", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 3, Entitled = "dwarf", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 4, Entitled = "night_elf", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 5, Entitled = "undead", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 6, Entitled = "tauren", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 7, Entitled = "gnome", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 8, Entitled = "troll", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 9, Entitled = "blood_elf", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 10, Entitled = "draenei", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 11, Entitled = "worgen", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 12, Entitled = "goblin", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 13, Entitled = "pandaren", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 14, Entitled = "vulpera", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 15, Entitled = "dracthyr", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
    ];
}
