using Microsoft.EntityFrameworkCore;

namespace WorldOfWarcraft.Database.Context;

public partial class WorldOfWarcraftDbContext
{
    partial void OnModelCreatingPartial(ModelBuilder modelBuilder)
    {
        PublicIdConvention.Apply(modelBuilder);
    }
}
