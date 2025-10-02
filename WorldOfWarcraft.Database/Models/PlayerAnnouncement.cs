using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

public partial class PlayerAnnouncement : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public string Message { get; set; } = null!;

    public int IdPlayer { get; set; }

    public virtual Player IdPlayerNavigation { get; set; } = null!;
}
