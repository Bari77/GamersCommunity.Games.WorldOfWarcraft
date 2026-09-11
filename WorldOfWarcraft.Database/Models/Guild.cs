using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

public partial class Guild : IKeyTable
{
    public int Id { get; set; }

    public Guid PublicId { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public string Entitled { get; set; } = null!;

    /// <summary>
    /// Four-digit suffix making the guild handle unique, displayed as <c>Entitled#Discriminator</c>.
    /// </summary>
    public string Discriminator { get; set; } = null!;

    public int Level { get; set; }

    public string? Sentence { get; set; }

    public string? LinkDiscord { get; set; }

    public string? LinkForum { get; set; }

    public int IdLeader { get; set; }

    public int IdMainDirection { get; set; }

    public virtual ICollection<GuildLink> GuildLinks { get; set; } = new List<GuildLink>();

    public virtual ICollection<GuildMember> GuildMembers { get; set; } = new List<GuildMember>();

    public virtual ICollection<GuildApplication> GuildApplications { get; set; } = new List<GuildApplication>();

    public virtual ICollection<GuildVip> GuildVips { get; set; } = new List<GuildVip>();

    public virtual ICollection<LfgAd> LfgAds { get; set; } = new List<LfgAd>();

    public virtual ICollection<GamePost> GamePosts { get; set; } = new List<GamePost>();

    public virtual Character IdLeaderNavigation { get; set; } = null!;

    public virtual Direction IdMainDirectionNavigation { get; set; } = null!;

    public virtual ICollection<Roster> Rosters { get; set; } = new List<Roster>();
}
