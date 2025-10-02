using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

public partial class Guild : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public string Entitled { get; set; } = null!;

    public int Level { get; set; }

    public string? Sentence { get; set; }

    public string? LinkDiscord { get; set; }

    public string? LinkForum { get; set; }

    public int IdLeader { get; set; }

    public int IdMainDirection { get; set; }

    public virtual ICollection<Character> Characters { get; set; } = new List<Character>();

    public virtual ICollection<GuildAnnouncement> GuildAnnouncements { get; set; } = new List<GuildAnnouncement>();

    public virtual ICollection<GuildLink> GuildLinks { get; set; } = new List<GuildLink>();

    public virtual ICollection<GuildMessage> GuildMessages { get; set; } = new List<GuildMessage>();

    public virtual ICollection<GuildRequest> GuildRequests { get; set; } = new List<GuildRequest>();

    public virtual ICollection<GuildVip> GuildVips { get; set; } = new List<GuildVip>();

    public virtual Character IdLeaderNavigation { get; set; } = null!;

    public virtual Direction IdMainDirectionNavigation { get; set; } = null!;

    public virtual ICollection<Roster> Rosters { get; set; } = new List<Roster>();
}
