using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

/// <summary>
/// Role a character fills in a group: tank, heal or dps. A guild-wide stance is a
/// <see cref="GuildOrientation"/> instead.
/// </summary>
public partial class Direction : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public string Entitled { get; set; } = null!;

    public virtual ICollection<Character> Characters { get; set; } = new List<Character>();

    public virtual ICollection<Roster> Rosters { get; set; } = new List<Roster>();
}
