using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Database.Seed;

public sealed class EventParticipantStatusesSeed : KeyTableSeed<WorldOfWarcraftDbContext, EventParticipantStatus>
{
    public override int Order => 5;

    protected override string TableName => nameof(WorldOfWarcraftDbContext.EventParticipantStatuses);

    protected override DbSet<EventParticipantStatus> GetSet(WorldOfWarcraftDbContext db) => db.EventParticipantStatuses;

    protected override IReadOnlyList<EventParticipantStatus> Rows { get; } =
    [
        new() { Id = 1, Entitled = "registered", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 2, Entitled = "confirmed", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 3, Entitled = "declined", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 4, Entitled = "waitlist", CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
    ];
}
