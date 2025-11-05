using GamersCommunity.Core.Tests;
using WorldOfWarcraft.Consumer.Services.Data;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Tests.Services.Data
{
    public class ClassesTests(TestsDataFixture fixture) : GenericDataServiceTests<WorldOfWarcraftDbContext, ClassesService, Class>, IClassFixture<TestsDataFixture>
    {
        protected override ClassesService CreateService()
        {
            var ctx = fixture.CreateContext();
            ctx.Classes.AddRange(GetFakeData());
            ctx.SaveChanges();

            fixture.SeedFullDataset(ctx);

            return new ClassesService(ctx);
        }

        protected override List<Class> GetFakeData()
        {
            return [];
        }

        protected override Class GetNewEntity()
        {
            return new Class
            {
                Entitled = "New class",
                CreationDate = DateTime.Now,
                ModificationDate = DateTime.Now,
            };
        }
    }
}
