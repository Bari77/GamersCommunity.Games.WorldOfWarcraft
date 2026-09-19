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

    /// <summary>
    /// Widget workspace of the guild page, serialized by the front end. Null until the leader
    /// arranges it, in which case the default layout shipped with the game applies.
    /// </summary>
    public string? LayoutJson { get; set; }

    /// <summary>
    /// Index of the emblem silhouette drawn at the centre of the crest, as named in
    /// <c>public/wow-crests/emblems</c>.
    /// </summary>
    public int CrestEmblem { get; set; }

    public string CrestEmblemColor { get; set; } = null!;

    /// <summary>
    /// Index of the border shape framing the crest, as named in <c>public/wow-crests/borders</c>.
    /// </summary>
    public int CrestBorder { get; set; }

    public string CrestBorderColor { get; set; } = null!;

    public string CrestBackgroundColor { get; set; } = null!;

    public int IdLeader { get; set; }

    public int IdOrientation { get; set; }

    public int IdServer { get; set; }

    public virtual ICollection<GuildLink> GuildLinks { get; set; } = new List<GuildLink>();

    public virtual ICollection<GuildMember> GuildMembers { get; set; } = new List<GuildMember>();

    public virtual ICollection<GuildApplication> GuildApplications { get; set; } = new List<GuildApplication>();

    public virtual ICollection<GuildVip> GuildVips { get; set; } = new List<GuildVip>();

    public virtual ICollection<LfgAd> LfgAds { get; set; } = new List<LfgAd>();

    public virtual ICollection<GamePost> GamePosts { get; set; } = new List<GamePost>();

    public virtual Character IdLeaderNavigation { get; set; } = null!;

    public virtual GuildOrientation IdOrientationNavigation { get; set; } = null!;

    public virtual Server IdServerNavigation { get; set; } = null!;

    public virtual ICollection<Roster> Rosters { get; set; } = new List<Roster>();
}
