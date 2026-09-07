using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

/// <summary>
/// Membership of a character in a guild, carrying the rank that drives guild permissions.
/// </summary>
/// <remarks>
/// Membership is held per character rather than per player: the same player can be an officer with
/// one character and a plain member with another.
/// </remarks>
public partial class GuildMember : IKeyTable
{
    public int Id { get; set; }

    public Guid PublicId { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public int IdGuild { get; set; }

    public int IdCharacter { get; set; }

    public int IdGuildRank { get; set; }

    public virtual Guild IdGuildNavigation { get; set; } = null!;

    public virtual Character IdCharacterNavigation { get; set; } = null!;

    public virtual GuildRank IdGuildRankNavigation { get; set; } = null!;
}
