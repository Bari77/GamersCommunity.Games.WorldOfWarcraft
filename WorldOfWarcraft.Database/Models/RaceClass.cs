using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

public partial class RaceClass : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public int IdClass { get; set; }

    public int IdRace { get; set; }

    public virtual Class IdClassNavigation { get; set; } = null!;

    public virtual Race IdRaceNavigation { get; set; } = null!;
}
