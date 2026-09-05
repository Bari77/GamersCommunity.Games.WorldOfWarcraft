using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Database.Seed;

public sealed class AlignmentsSeed : KeyTableSeed<WorldOfWarcraftDbContext, Alignment>
{
    protected override string TableName => nameof(WorldOfWarcraftDbContext.Alignments);

    protected override DbSet<Alignment> GetSet(WorldOfWarcraftDbContext db) => db.Alignments;

    protected override IReadOnlyList<Alignment> Rows { get; } =
    [
        new() { Id = 1, Entitled = "alliance", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 2, Entitled = "horde", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
    ];
}
