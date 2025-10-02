using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

public partial class Server : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public string Entitled { get; set; } = null!;

    public int IdLocale { get; set; }

    public virtual ICollection<Character> Characters { get; set; } = new List<Character>();
}
