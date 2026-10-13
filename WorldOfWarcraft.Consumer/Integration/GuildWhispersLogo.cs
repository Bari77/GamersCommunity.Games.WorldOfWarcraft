using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Consumer.Integration;

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
