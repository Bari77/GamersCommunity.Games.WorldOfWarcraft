using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Serilog;
using GamersCommunity.Core.Platform;
using WorldOfWarcraft.Consumer.Configuration;
using WorldOfWarcraft.Database.Context;
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

/// <summary>
/// Keeps the Platform Whispers guild channel aligned with the roster: created with the guild,
/// members follow join/leave, and the logo follows the crest.
/// </summary>
public sealed class GuildWhispers(
    WorldOfWarcraftDbContext context,
    IPlatformConversationsClient conversations,
    IOptions<AppSettings> appSettings,
    ILogger logger) : IGuildWhispers
{
    public async Task OnCreatedAsync(Guild guild, int founderCharacterId, CancellationToken ct) =>
        await TryAsync("create", () => EnsureAndAddAsync(guild, founderCharacterId, ct));

    public async Task OnUpdatedAsync(Guild guild, CancellationToken ct)
    {
        await TryAsync("refresh", async () =>
        {
            var owner = await PlatformUserOfCharacterAsync(guild.IdLeader, ct);
            if (owner is null)
            {
                logger.Warning("Guild {GuildId} has no Platform owner; Whispers channel was not refreshed.", guild.PublicId);
                return;
            }

            await conversations.EnsureGuildChannelAsync(
                KeyFor(guild.PublicId),
                ChannelTitle(guild),
                await PictureAsync(guild, ct),
                owner.Value,
                ct);
        });
    }

    public async Task OnMemberJoinedAsync(Guild guild, int characterId, CancellationToken ct) =>
        await TryAsync("add member", () => EnsureAndAddAsync(guild, characterId, ct));

    public async Task OnMemberLeftAsync(int guildId, Guid guildPublicId, int characterId, CancellationToken ct)
    {
        await TryAsync("remove member", async () =>
        {
            var playerId = await context.Characters.AsNoTracking()
                .Where(c => c.Id == characterId)
                .Select(c => c.IdPlayer)
                .FirstOrDefaultAsync(ct);
            if (playerId == 0)
                return;

            var stillInGuild = await context.GuildMembers.AsNoTracking()
                .AnyAsync(
                    m => m.IdGuild == guildId
                        && m.IdCharacter != characterId
                        && m.IdCharacterNavigation.IdPlayer == playerId,
                    ct);
            if (stillInGuild)
                return;

            var user = await PlatformUserOfCharacterAsync(characterId, ct);
            if (user is null)
                return;

            await conversations.RemoveGuildMemberAsync(KeyFor(guildPublicId), user.Value, ct);
        });
    }

    public async Task OnDisbandedAsync(Guid guildPublicId, CancellationToken ct) =>
        await TryAsync("delete", () => conversations.DeleteGuildChannelAsync(KeyFor(guildPublicId), ct));

    private async Task TryAsync(string op, Func<Task> action)
    {
        try
        {
            await action();
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            logger.Error(ex, "Could not {Op} the guild Whispers channel.", op);
        }
    }

    private async Task EnsureAndAddAsync(Guild guild, int characterId, CancellationToken ct)
    {
        var owner = await PlatformUserOfCharacterAsync(guild.IdLeader, ct);
        if (owner is null)
        {
            logger.Warning("Guild {GuildId} has no Platform owner; Whispers channel was not created.", guild.PublicId);
            return;
        }

        var key = KeyFor(guild.PublicId);
        await conversations.EnsureGuildChannelAsync(
            key,
            ChannelTitle(guild),
            await PictureAsync(guild, ct),
            owner.Value,
            ct);

        var member = await PlatformUserOfCharacterAsync(characterId, ct);
        if (member is null || member == owner)
            return;

        await conversations.AddGuildMemberAsync(key, member.Value, ct);
    }

    private async Task<string> PictureAsync(Guild guild, CancellationToken ct)
    {
        var faction = await context.Characters.AsNoTracking()
            .Where(c => c.Id == guild.IdLeader)
            .Select(c => c.IdAlignmentNavigation != null ? c.IdAlignmentNavigation.Entitled : null)
            .FirstOrDefaultAsync(ct);

        return GuildWhispersLogo.FromCrest(guild, appSettings.Value.PublicAssetsUrl, faction);
    }

    private async Task<Guid?> PlatformUserOfCharacterAsync(int characterId, CancellationToken ct)
    {
        var publicId = await context.Characters.AsNoTracking()
            .Where(c => c.Id == characterId)
            .Select(c => c.IdPlayerNavigation.PlatformUserPublicId)
            .FirstOrDefaultAsync(ct);

        return publicId is { } id && id != Guid.Empty ? id : null;
    }

    internal static string KeyFor(Guid guildPublicId) => $"wow:guild:{guildPublicId:D}";

    internal static string ChannelTitle(Guild guild) => $"{guild.Entitled}#{guild.Discriminator}";
}

/// <summary>
/// Compact token Platform Whispers can turn into the real tabard: origin of the crest artwork plus
/// the parts already stored on the guild. Kept under the 255-character picture URL cap.
/// </summary>
internal static class GuildWhispersLogo
{
    public static string FromCrest(Guild guild, string? assetsOrigin, string? faction)
    {
        var origin = (assetsOrigin ?? "").Trim().TrimEnd('/');
        if (string.IsNullOrEmpty(origin))
            origin = "http://localhost:4201";

        var side = string.Equals(faction, "horde", StringComparison.OrdinalIgnoreCase) ? "horde" : "alliance";
        var token =
            $"wow-crest:v1|{origin}|{side}|{guild.CrestEmblem}|{Hex(guild.CrestEmblemColor)}|{guild.CrestBorder}|{Hex(guild.CrestBorderColor)}|{Hex(guild.CrestBackgroundColor)}";
        if (token.Length > 255)
            throw new InvalidOperationException("Guild Whispers logo exceeds the picture URL length.");
        return token;
    }

    private static string Hex(string color)
    {
        var value = (color ?? "").Trim().ToLowerInvariant();
        return value.Length == 7 && value[0] == '#' ? value : "#1e2a4a";
    }
}
