using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

public partial class SpecializationClass : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public string Entitled { get; set; } = null!;

    public int IdSpecialization { get; set; }

    public int IdClass { get; set; }

    public virtual ICollection<Character> CharacterIdMainSpecializationClassNavigations { get; set; } = new List<Character>();

    public virtual ICollection<Character> CharacterIdSecondarySpecializationClassNavigations { get; set; } = new List<Character>();

    public virtual Class IdClassNavigation { get; set; } = null!;

    public virtual Specialization IdSpecializationNavigation { get; set; } = null!;
}
