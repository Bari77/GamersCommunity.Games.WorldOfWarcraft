using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Consumer.Services.Data;

public sealed class PlayerStreamsService(WorldOfWarcraftDbContext context)
    : PlayerMediaService<PlayerStream>(context, "PlayerStreams")
{
    protected override DbSet<PlayerStream> Entities => Context.PlayerStreams;

    protected override Expression<Func<PlayerStream, bool>> OwnedBy(int idPlayer) => m => m.IdPlayer == idPlayer;

    protected override Expression<Func<PlayerStream, bool>> WithPublicId(Guid publicId) => m => m.PublicId == publicId;
}
