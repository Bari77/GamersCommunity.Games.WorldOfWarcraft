using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

public partial class CharacterJob : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public int Level { get; set; }

    public int IdCharacter { get; set; }

    public int IdJob { get; set; }

    public virtual Character IdCharacterNavigation { get; set; } = null!;

    public virtual Job IdJobNavigation { get; set; } = null!;
}
