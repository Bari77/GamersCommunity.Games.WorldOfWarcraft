using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Database.Seed;

public sealed class GuildRanksSeed : KeyTableSeed<WorldOfWarcraftDbContext, GuildRank>
{
    public override int Order => 5;

    protected override string TableName => nameof(WorldOfWarcraftDbContext.GuildRanks);

    protected override DbSet<GuildRank> GetSet(WorldOfWarcraftDbContext db) => db.GuildRanks;

    protected override IReadOnlyList<GuildRank> Rows { get; } =
    [
        new() { Id = 1, Entitled = GuildRankCodes.Leader, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 2, Entitled = GuildRankCodes.Officer, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 3, Entitled = GuildRankCodes.Member, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
    ];
}
