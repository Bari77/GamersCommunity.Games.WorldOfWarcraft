using Microsoft.EntityFrameworkCore;

namespace WorldOfWarcraft.Database.Context;

/// <summary>
/// Configuration design-time du DbContext (outils <c>dotnet ef</c>).
/// En runtime, la chaîne de connexion est injectée via DI dans <c>WorldOfWarcraft.Consumer</c>.
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
