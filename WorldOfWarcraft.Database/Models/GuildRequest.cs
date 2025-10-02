using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

public partial class GuildRequest : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public string Title { get; set; } = null!;

    public string Request { get; set; } = null!;

    public int IdGuild { get; set; }

    public virtual Guild IdGuildNavigation { get; set; } = null!;
}
