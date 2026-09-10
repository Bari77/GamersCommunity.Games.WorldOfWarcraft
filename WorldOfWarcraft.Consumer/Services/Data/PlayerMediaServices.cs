using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Consumer.Services.Data;

public sealed class PlayerPicturesService(WorldOfWarcraftDbContext context)
    : PlayerMediaService<PlayerPicture>(context, "PlayerPictures")
{
    protected override DbSet<PlayerPicture> Entities => Context.PlayerPictures;

    protected override Expression<Func<PlayerPicture, bool>> OwnedBy(int idPlayer) => m => m.IdPlayer == idPlayer;

    protected override Expression<Func<PlayerPicture, bool>> WithPublicId(Guid publicId) => m => m.PublicId == publicId;
}

public sealed class PlayerVideosService(WorldOfWarcraftDbContext context)
    : PlayerMediaService<PlayerVideo>(context, "PlayerVideos")
{
    protected override DbSet<PlayerVideo> Entities => Context.PlayerVideos;

    protected override Expression<Func<PlayerVideo, bool>> OwnedBy(int idPlayer) => m => m.IdPlayer == idPlayer;

    protected override Expression<Func<PlayerVideo, bool>> WithPublicId(Guid publicId) => m => m.PublicId == publicId;
}

public sealed class PlayerStreamsService(WorldOfWarcraftDbContext context)
    : PlayerMediaService<PlayerStream>(context, "PlayerStreams")
{
    protected override DbSet<PlayerStream> Entities => Context.PlayerStreams;

    protected override Expression<Func<PlayerStream, bool>> OwnedBy(int idPlayer) => m => m.IdPlayer == idPlayer;

    protected override Expression<Func<PlayerStream, bool>> WithPublicId(Guid publicId) => m => m.PublicId == publicId;
}
