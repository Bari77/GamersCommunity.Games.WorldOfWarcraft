using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

/// <summary>
/// Application sent by a character to join a guild, reviewed by the guild leader or an officer.
/// </summary>
/// <remarks>
/// The candidate is a character and not a player, for the same reason as <see cref="GuildMember"/>:
/// a player may apply to several guilds at once with different characters.
/// </remarks>
public partial class GuildApplication : IKeyTable
{
    public int Id { get; set; }

    public Guid PublicId { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public int IdGuild { get; set; }

    public int IdCharacter { get; set; }

    public string Message { get; set; } = null!;

    public int IdStatus { get; set; }

    /// <summary>
    /// Character of the officer who accepted or rejected the application.
    /// </summary>
    public int? IdReviewer { get; set; }

    public DateTime? ReviewedAt { get; set; }

    public virtual Guild IdGuildNavigation { get; set; } = null!;

    public virtual Character IdCharacterNavigation { get; set; } = null!;

    public virtual Character? IdReviewerNavigation { get; set; }

    public virtual GuildApplicationStatus IdStatusNavigation { get; set; } = null!;
}
