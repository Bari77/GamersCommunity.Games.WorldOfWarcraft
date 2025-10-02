using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

public partial class Job : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public string Entitled { get; set; } = null!;

    public virtual ICollection<CharacterJob> CharacterJobs { get; set; } = new List<CharacterJob>();
}
