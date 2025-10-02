using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

public partial class Player : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public string? PresentationIrl { get; set; }

    public string? PresentationIg { get; set; }

    public int? SuccessPoints { get; set; }

    public int NbMount { get; set; }

    public int IdUser { get; set; }

    public int? IdRank { get; set; }

    public virtual ICollection<Character> Characters { get; set; } = new List<Character>();

    public virtual ICollection<PlayerAnnouncement> PlayerAnnouncements { get; set; } = new List<PlayerAnnouncement>();

    public virtual ICollection<PlayerLink> PlayerLinks { get; set; } = new List<PlayerLink>();

    public virtual ICollection<PlayerPicture> PlayerPictures { get; set; } = new List<PlayerPicture>();

    public virtual ICollection<PlayerRank> PlayerRanks { get; set; } = new List<PlayerRank>();

    public virtual ICollection<PlayerStream> PlayerStreams { get; set; } = new List<PlayerStream>();

    public virtual ICollection<PlayerVideo> PlayerVideos { get; set; } = new List<PlayerVideo>();

    public virtual ICollection<PlayerVip> PlayerVips { get; set; } = new List<PlayerVip>();
}
