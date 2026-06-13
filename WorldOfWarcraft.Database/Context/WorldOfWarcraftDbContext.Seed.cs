using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Database.Seed;

namespace WorldOfWarcraft.Database.Context;

public partial class WorldOfWarcraftDbContext
{
    partial void OnModelCreatingPartial(ModelBuilder modelBuilder)
    {
        ReferenceDataSeed.Apply(modelBuilder);
    }
}
