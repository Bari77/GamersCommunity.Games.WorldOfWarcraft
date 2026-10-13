using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Consumer.Integration;

public interface IGuildWhispers
{
    Task OnCreatedAsync(Guild guild, int founderCharacterId, CancellationToken ct);

    Task OnUpdatedAsync(Guild guild, CancellationToken ct);

    Task OnMemberJoinedAsync(Guild guild, int characterId, CancellationToken ct);

    Task OnMemberLeftAsync(int guildId, Guid guildPublicId, int characterId, CancellationToken ct);

    Task OnDisbandedAsync(Guid guildPublicId, CancellationToken ct);
}
