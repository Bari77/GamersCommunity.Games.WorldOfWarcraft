using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

public partial class GamePost : IKeyTable
{
    public int Id { get; set; }

    public Guid PublicId { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public int IdPlayer { get; set; }

    public int? IdGuild { get; set; }

    public string Body { get; set; } = null!;

    public string? MediaUrl { get; set; }

    public string? MediaKind { get; set; }

    public int IdStatus { get; set; }

    /// <summary>
    /// Character of the officer who approved or rejected the post.
    /// </summary>
    public int? IdModerator { get; set; }

    public DateTime? ModeratedAt { get; set; }

    public string? ModerationReason { get; set; }

    public virtual Player IdPlayerNavigation { get; set; } = null!;

    public virtual Guild? IdGuildNavigation { get; set; }

    public virtual Character? IdModeratorNavigation { get; set; }

    public virtual GamePostStatus IdStatusNavigation { get; set; } = null!;
}
