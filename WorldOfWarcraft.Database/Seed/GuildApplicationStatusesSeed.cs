using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Database.Seed;

public sealed class GuildApplicationStatusesSeed : KeyTableSeed<WorldOfWarcraftDbContext, GuildApplicationStatus>
{
    public override int Order => 5;

    protected override string TableName => nameof(WorldOfWarcraftDbContext.GuildApplicationStatuses);

    protected override DbSet<GuildApplicationStatus> GetSet(WorldOfWarcraftDbContext db) => db.GuildApplicationStatuses;

    protected override IReadOnlyList<GuildApplicationStatus> Rows { get; } =
    [
        new() { Id = 1, Entitled = GuildApplicationStatusCodes.Pending, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 2, Entitled = GuildApplicationStatusCodes.Accepted, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 3, Entitled = GuildApplicationStatusCodes.Rejected, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 4, Entitled = GuildApplicationStatusCodes.Withdrawn, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
    ];
}
