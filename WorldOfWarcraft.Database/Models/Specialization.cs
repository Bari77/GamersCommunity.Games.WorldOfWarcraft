using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

public partial class Specialization : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public string Entitled { get; set; } = null!;

    public virtual ICollection<RosterMember> RosterMembers { get; set; } = new List<RosterMember>();

    public virtual ICollection<SpecializationClass> SpecializationClasses { get; set; } = new List<SpecializationClass>();
}
