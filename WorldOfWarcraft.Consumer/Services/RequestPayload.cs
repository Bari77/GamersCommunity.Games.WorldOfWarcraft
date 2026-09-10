using System.Text.Json;

namespace WorldOfWarcraft.Consumer.Services;

/// <summary>
/// Helpers for update payloads, which only carry the fields the caller changed.
/// </summary>
public static class RequestPayload
{
    /// <summary>
    /// Property names the payload actually carries. A deserialized request cannot tell a
    /// field the caller left out from one sent as null, yet the two mean opposite things:
    /// keep the stored value, or clear the column.
    /// </summary>
    public static HashSet<string> SentFields(string data)
    {
        using var document = JsonDocument.Parse(data);
        if (document.RootElement.ValueKind is not JsonValueKind.Object)
            return [];

        return new HashSet<string>(
            document.RootElement.EnumerateObject().Select(property => property.Name),
            StringComparer.OrdinalIgnoreCase);
    }
}
