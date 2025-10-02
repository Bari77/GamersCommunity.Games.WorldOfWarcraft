using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

public partial class GuildMessage : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public string Message { get; set; } = null!;

    public int IdGuild { get; set; }

    public int IdCharacter { get; set; }

    public virtual Character IdCharacterNavigation { get; set; } = null!;

    public virtual Guild IdGuildNavigation { get; set; } = null!;
}
