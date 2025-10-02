using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

public partial class Class : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public string Entitled { get; set; } = null!;

    public virtual ICollection<RaceClass> RaceClasses { get; set; } = new List<RaceClass>();

    public virtual ICollection<SpecializationClass> SpecializationClasses { get; set; } = new List<SpecializationClass>();
}
