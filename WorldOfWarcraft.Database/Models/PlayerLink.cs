using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

public partial class PlayerLink : IKeyTable
{
    public int Id { get; set; }

    public Guid PublicId { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public string Url { get; set; } = null!;

    public string Label { get; set; } = null!;

    /// <summary>
    /// Social network key backing the card icon, such as <c>youtube</c> or <c>discord</c>.
    /// Kept free-form so a new network only needs a front-end release, and null when the
    /// owner wants the generic link icon.
    /// </summary>
    public string? Icon { get; set; }

    /// <summary>Rank inside the owner's list; ties are broken by creation date.</summary>
    public int Position { get; set; }

    public int IdPlayer { get; set; }

    public virtual Player IdPlayerNavigation { get; set; } = null!;
}
