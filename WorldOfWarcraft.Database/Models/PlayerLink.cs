using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

public partial class PlayerLink : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public string Url { get; set; } = null!;

    public int Icon { get; set; }

    public int IdPlayer { get; set; }

    public virtual Player IdPlayerNavigation { get; set; } = null!;
}
