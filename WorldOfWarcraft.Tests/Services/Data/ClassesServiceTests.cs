using GamersCommunity.Core.Tests;
using WorldOfWarcraft.Consumer.Services.Data;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Tests.Services.Data
{
    public class ClassesServiceTests : GenericDataServiceTests<WorldOfWarcraftDbContext, ClassesService, Class>, IClassFixture<FakeDataset>
    {
        protected override List<Class> GetFakeData() => [];

        protected override Class GetNewEntity() => new()
        {
            Entitled = "New class",
            CreationDate = DateTime.UtcNow,
            ModificationDate = DateTime.UtcNow,
        };

        protected override ClassesService CreateService() => new(CreateContext());
    }
}
