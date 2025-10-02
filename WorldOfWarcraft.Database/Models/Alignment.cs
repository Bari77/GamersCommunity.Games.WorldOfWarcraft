using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

public partial class Alignment : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public string Entitled { get; set; } = null!;

    public virtual ICollection<Character> Characters { get; set; } = new List<Character>();

    public virtual ICollection<Event> Events { get; set; } = new List<Event>();
}
