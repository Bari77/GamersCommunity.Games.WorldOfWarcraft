using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

public partial class PlayerRank : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public int IdPlayer { get; set; }

    public int IdRank { get; set; }

    public virtual Player IdPlayerNavigation { get; set; } = null!;
}
