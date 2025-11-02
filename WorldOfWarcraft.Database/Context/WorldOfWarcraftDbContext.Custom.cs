using Microsoft.EntityFrameworkCore;

namespace WorldOfWarcraft.Database.Context
{
    public partial class WorldOfWarcraftDbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Name=ConnectionStrings:Database");
            }
        }
    }
}
