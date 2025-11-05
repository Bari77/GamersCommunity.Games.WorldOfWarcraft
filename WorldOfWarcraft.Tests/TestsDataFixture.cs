using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Consumer.Services.Data;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Tests
{
    public class TestsDataFixture : IDisposable
    {
        /// <summary>
        /// Creates a new in-memory <see cref="WorldOfWarcraftDbContext"/> with a unique database name.
        /// </summary>
        public WorldOfWarcraftDbContext CreateContext()
        {
            var options = new DbContextOptionsBuilder<WorldOfWarcraftDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new WorldOfWarcraftDbContext(options);
        }

        /// <summary>
        /// Creates a fully functional <see cref="ClassesService"/> with all required dependencies and seeded data.
        /// </summary>
        public ClassesService CreateClassesService()
        {
            var ctx = CreateContext();
            SeedFullDataset(ctx);

            return new ClassesService(ctx);
        }

        /// <summary>
        /// Seeds the full test dataset required across all services (relations, dependencies, etc.).
        /// </summary>
        public void SeedFullDataset(WorldOfWarcraftDbContext ctx)
        {
            if (!ctx.Classes.Any())
            {
                ctx.Classes.AddRange(
                    new Class { Id = 1, Entitled = "Class A", CreationDate = DateTime.Now, ModificationDate = DateTime.Now },
                    new Class { Id = 2, Entitled = "Class B", CreationDate = DateTime.Now, ModificationDate = DateTime.Now }
                );
            }

            ctx.SaveChanges();
        }

        /// <summary>
        /// Called when test is ended
        /// </summary>
        public void Dispose()
        {
            // Clean
        }
    }
}
