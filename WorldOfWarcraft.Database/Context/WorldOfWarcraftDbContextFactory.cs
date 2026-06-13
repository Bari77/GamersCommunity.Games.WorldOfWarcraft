using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace WorldOfWarcraft.Database.Context;

/// <summary>
/// Factory utilisée par les outils EF Core (<c>dotnet ef</c>) en design-time.
/// </summary>
public class WorldOfWarcraftDbContextFactory : IDesignTimeDbContextFactory<WorldOfWarcraftDbContext>
{
    public WorldOfWarcraftDbContext CreateDbContext(string[] args)
    {
        var basePath = Path.Combine(Directory.GetCurrentDirectory(), "../WorldOfWarcraft.Consumer");
        var configuration = new ConfigurationBuilder()
            .SetBasePath(basePath)
            .AddJsonFile("appsettings.Development.json", optional: false)
            .AddEnvironmentVariables()
            .Build();

        var connectionString = configuration.GetConnectionString("Database")
            ?? throw new InvalidOperationException("Connection string 'Database' is missing.");

        var optionsBuilder = new DbContextOptionsBuilder<WorldOfWarcraftDbContext>();
        optionsBuilder.UseSqlServer(connectionString);

        return new WorldOfWarcraftDbContext(optionsBuilder.Options);
    }
}
