using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Consumer.Services.Data;

public sealed class PlayerVideosService(WorldOfWarcraftDbContext context)
    : PlayerMediaService<PlayerVideo>(context, "PlayerVideos")
{
    protected override DbSet<PlayerVideo> Entities => Context.PlayerVideos;

    protected override Expression<Func<PlayerVideo, bool>> OwnedBy(int idPlayer) => m => m.IdPlayer == idPlayer;

    protected override Expression<Func<PlayerVideo, bool>> WithPublicId(Guid publicId) => m => m.PublicId == publicId;
}
