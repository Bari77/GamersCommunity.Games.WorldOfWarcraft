using GamersCommunity.Core.Exceptions;
using GamersCommunity.Core.Rabbit;
using GamersCommunity.Core.Serialization;
using GamersCommunity.Core.Services;
using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Consumer.Models;
using WorldOfWarcraft.Consumer.Security;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Consumer.Services.Data;

public class PlayersService(WorldOfWarcraftDbContext context)
    : GenericDataService<WorldOfWarcraftDbContext, Player>(context, "Players")
{
    public override async Task<string> HandleAsync(BusMessage message, CancellationToken ct = default)
    {
        switch (message.Action)
        {
            case "Load":
                return JsonSafe.Serialize(await LoadAsync(message, ct));

            case "Resolve":
                return JsonSafe.Serialize(await ResolveByPlatformUserAsync(message, ct));

            case "Get":
                return JsonSafe.Serialize(await GetSheetAsync(message, ct));

            case "Update":
                return JsonSafe.Serialize(await UpdateSheetAsync(message, ct));
        }

        return await base.HandleAsync(message, ct);
    }

    private async Task<PlayerSheetDto> LoadAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<PlayerLoadRequest>(message.Data);
        if (request.PlatformUserId <= 0 || request.PlatformUserPublicId == Guid.Empty)
            throw new BadRequestException("INVALID_PLATFORM_USER", "Platform user identity is required");

        var idKeycloak = CallerAuth.RequireKeycloakId(message);
        var player = await Context.Players.FirstOrDefaultAsync(p => p.IdKeycloak == idKeycloak, ct);

        if (player is null)
        {
            player = new Player
            {
                PublicId = Guid.NewGuid(),
                IdKeycloak = idKeycloak,
                PlatformUserPublicId = request.PlatformUserPublicId,
                IdUser = request.PlatformUserId,
                CreationDate = DateTime.UtcNow,
                ModificationDate = DateTime.UtcNow,
            };
            await Context.Players.AddAsync(player, ct);
            await Context.SaveChangesAsync(ct);
        }
        else if (player.PlatformUserPublicId != request.PlatformUserPublicId || player.IdUser != request.PlatformUserId)
        {
            player.PlatformUserPublicId = request.PlatformUserPublicId;
            player.IdUser = request.PlatformUserId;
            player.ModificationDate = DateTime.UtcNow;
            await Context.SaveChangesAsync(ct);
        }

        return await ToSheetDtoAsync(player.Id, ct);
    }

    private async Task<PlayerResolveResult> ResolveByPlatformUserAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<PlayerResolveRequest>(message.Data);
        if (request.PlatformUserPublicId == Guid.Empty)
            throw new BadRequestException("INVALID_PLATFORM_USER", "Platform user public id is required");

        var player = await Context.Players.AsNoTracking()
            .FirstOrDefaultAsync(p => p.PlatformUserPublicId == request.PlatformUserPublicId, ct);

        return new PlayerResolveResult
        {
            PlayerPublicId = player?.PublicId,
        };
    }

    private async Task<PlayerSheetDto> GetSheetAsync(BusMessage message, CancellationToken ct)
    {
        var player = await ResolvePlayerAsync(message, ct);
        return await ToSheetDtoAsync(player.Id, ct);
    }

    private async Task<PlayerSheetDto> UpdateSheetAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<PlayerUpdateRequest>(message.Data);
        var caller = await CallerAuth.RequirePlayerAsync(Context, message, ct);
        var target = await Context.Players
            .FirstOrDefaultAsync(p => message.PublicId != null && p.PublicId == message.PublicId, ct)
            ?? throw new NotFoundException("NOT_FOUND", "Cannot find ressource");

        if (caller.Id != target.Id)
            throw new ForbiddenException("FORBIDDEN", "Cannot update another player's sheet");

        if (request.PresentationIrl is not null)
            target.PresentationIrl = request.PresentationIrl;
        if (request.PresentationIg is not null)
            target.PresentationIg = request.PresentationIg;

        target.ModificationDate = DateTime.UtcNow;
        await Context.SaveChangesAsync(ct);

        return await ToSheetDtoAsync(target.Id, ct);
    }

    private async Task<Player> ResolvePlayerAsync(BusMessage message, CancellationToken ct)
    {
        if (message.PublicId is Guid publicId)
            return await Context.Players.AsNoTracking()
                       .FirstOrDefaultAsync(p => p.PublicId == publicId, ct)
                   ?? throw new NotFoundException("NOT_FOUND", "Cannot find ressource");

        if (message.Id is int id)
            return await Context.Players.AsNoTracking()
                       .FirstOrDefaultAsync(p => p.Id == id, ct)
                   ?? throw new NotFoundException("NOT_FOUND", "Cannot find ressource");

        throw new BadRequestException("ID_MANDATORY", "Id mandatory");
    }

    private async Task<PlayerSheetDto> ToSheetDtoAsync(int playerId, CancellationToken ct)
    {
        var player = await Context.Players.AsNoTracking()
            .Where(p => p.Id == playerId)
            .Select(p => new
            {
                p.PublicId,
                p.PlatformUserPublicId,
                p.PresentationIrl,
                p.PresentationIg,
                p.NbMount,
                p.SuccessPoints,
                p.CreationDate,
                CharacterCount = p.Characters.Count,
            })
            .FirstAsync(ct);

        return new PlayerSheetDto
        {
            PublicId = player.PublicId,
            PlatformUserPublicId = player.PlatformUserPublicId ?? Guid.Empty,
            PresentationIrl = player.PresentationIrl,
            PresentationIg = player.PresentationIg,
            NbMount = player.NbMount,
            SuccessPoints = player.SuccessPoints,
            CreationDate = player.CreationDate,
            CharacterCount = player.CharacterCount,
        };
    }
}
