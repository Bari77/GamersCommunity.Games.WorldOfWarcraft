using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

public partial class PlayerVip : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public DateTime? BeginDate { get; set; }

    public DateTime? EndDate { get; set; }

    public string Messages { get; set; } = null!;

    public bool Activation { get; set; }

    public int IdPlayer { get; set; }

    public virtual Player IdPlayerNavigation { get; set; } = null!;
}
