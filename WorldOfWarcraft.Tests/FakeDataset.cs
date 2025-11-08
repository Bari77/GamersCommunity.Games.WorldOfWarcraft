using GamersCommunity.Core.Tests;
using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Tests
{
    public class FakeDataset : IFakeDataset<WorldOfWarcraftDbContext>
    {
        /// <summary>
        /// Creates a new in-memory <see cref="WorldOfWarcraftDbContext"/> with a unique database name.
        /// </summary>
        public WorldOfWarcraftDbContext CreateFakeContext() => SeedFakeData(new WorldOfWarcraftDbContext(
            new DbContextOptionsBuilder<WorldOfWarcraftDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options
            ));

        /// <summary>
        /// Seeds the full test dataset required across all services (relations, dependencies, etc.).
        /// </summary>
        private WorldOfWarcraftDbContext SeedFakeData(WorldOfWarcraftDbContext ctx)
        {
            ctx.ChangeTracker.AutoDetectChangesEnabled = false;

            #region Classes

            if (!ctx.Classes.Any())
            {
                ctx.Classes.AddRange(
                    new Class
                    {
                        Id = 1,
                        Entitled = "Class A",
                        CreationDate = DateTime.UtcNow,
                        ModificationDate = DateTime.UtcNow,
                    },
                    new Class
                    {
                        Id = 2,
                        Entitled = "Class B",
                        CreationDate = DateTime.UtcNow,
                        ModificationDate = DateTime.UtcNow
                    }
                );
            }

            #endregion

            ctx.ChangeTracker.AutoDetectChangesEnabled = true;

            ctx.SaveChanges();

            return ctx;
        }
    }
}
