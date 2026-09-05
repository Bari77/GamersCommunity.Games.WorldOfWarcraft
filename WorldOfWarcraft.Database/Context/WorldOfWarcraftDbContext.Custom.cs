using Microsoft.EntityFrameworkCore;

namespace WorldOfWarcraft.Database.Context;

/// <summary>
/// Design-time DbContext configuration (<c>dotnet ef</c> tools).
/// At runtime, the connection string is injected via DI in <c>WorldOfWarcraft.Consumer</c>.
/// </summary>
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
