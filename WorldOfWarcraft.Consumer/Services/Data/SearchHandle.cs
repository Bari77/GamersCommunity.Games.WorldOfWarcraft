namespace WorldOfWarcraft.Consumer.Services.Data;

/// <summary>
/// Parses a <c>Name#1234</c> search term into its name and discriminator parts.
/// </summary>
/// <remarks>
/// Guilds and Platform players both publish their identity as a handle, so the guild directory, the
/// player search and the global search page all need the same reading of a query.
/// </remarks>
internal static class SearchHandle
{
    /// <summary>
    /// Returns a null discriminator when the term is a plain name. A leading or trailing <c>#</c> is
    /// left inside the name: it is a user still typing, not a discriminator.
    /// </summary>
    public static (string Name, string? Discriminator) Split(string query)
    {
        var trimmed = query.Trim();
        var separator = trimmed.LastIndexOf('#');
        if (separator <= 0 || separator == trimmed.Length - 1)
            return (trimmed, null);

        return (trimmed[..separator], trimmed[(separator + 1)..]);
    }
}
