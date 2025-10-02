using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

public partial class RosterMember : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public int IdRoster { get; set; }

    public int IdCharacter { get; set; }

    public int IdSpecialization { get; set; }

    public virtual Character IdCharacterNavigation { get; set; } = null!;

    public virtual Roster IdRosterNavigation { get; set; } = null!;

    public virtual Specialization IdSpecializationNavigation { get; set; } = null!;
}
