using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

public partial class EventParticipant : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public int? IdStatus { get; set; }

    public int IdCharacters { get; set; }

    public int IdEvent { get; set; }

    public virtual Character IdCharactersNavigation { get; set; } = null!;

    public virtual Event IdEventNavigation { get; set; } = null!;
}
