using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Database.Seed;

public sealed class ServersSeed : KeyTableSeed<WorldOfWarcraftDbContext, Server>
{
    protected override string TableName => nameof(WorldOfWarcraftDbContext.Servers);

    protected override DbSet<Server> GetSet(WorldOfWarcraftDbContext db) => db.Servers;

    protected override IReadOnlyList<Server> Rows { get; } =
    [
        new() { Id = 1, Entitled = "archimonde", IdLocale = 3, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 2, Entitled = "khaz_modan", IdLocale = 3, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 3, Entitled = "hyjal", IdLocale = 3, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 4, Entitled = "illidan", IdLocale = 3, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
    ];
}
