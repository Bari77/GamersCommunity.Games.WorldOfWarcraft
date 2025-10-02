using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

public partial class Direction : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public string Entitled { get; set; } = null!;

    public virtual ICollection<Character> Characters { get; set; } = new List<Character>();

    public virtual ICollection<Guild> Guilds { get; set; } = new List<Guild>();

    public virtual ICollection<Roster> Rosters { get; set; } = new List<Roster>();
}
