using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

public partial class GuildLink : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public string Link { get; set; } = null!;

    public string? Icon { get; set; }

    public int IdGuild { get; set; }

    public virtual Guild IdGuildNavigation { get; set; } = null!;
}
