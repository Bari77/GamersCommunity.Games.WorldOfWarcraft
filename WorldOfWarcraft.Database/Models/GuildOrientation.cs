using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

/// <summary>
/// What a guild plays: player versus environment, player versus player, or both. This is a
/// guild-wide stance and has nothing to do with <see cref="Direction"/>, which is the role a
/// single character fills in a group.
/// </summary>
public partial class GuildOrientation : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public string Entitled { get; set; } = null!;

    public virtual ICollection<Guild> Guilds { get; set; } = new List<Guild>();
}
