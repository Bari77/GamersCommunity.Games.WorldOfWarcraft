using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

public partial class LfgAd : IKeyTable
{
    public int Id { get; set; }

    public Guid PublicId { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public int IdPlayer { get; set; }

    public int? IdGuild { get; set; }

    public string Kind { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string Body { get; set; } = null!;

    public int? IdServer { get; set; }

    public int? IdDirection { get; set; }

    public DateTime ExpiresAt { get; set; }

    public bool IsActive { get; set; }

    public virtual Player IdPlayerNavigation { get; set; } = null!;

    public virtual Guild? IdGuildNavigation { get; set; }

    public virtual Server? IdServerNavigation { get; set; }

    public virtual Direction? IdDirectionNavigation { get; set; }
}
