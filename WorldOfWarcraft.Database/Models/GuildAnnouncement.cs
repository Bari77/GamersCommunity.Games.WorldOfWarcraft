using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

public partial class GuildAnnouncement : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public string Message { get; set; } = null!;

    public int IdGuild { get; set; }

    public virtual Guild IdGuildNavigation { get; set; } = null!;
}
