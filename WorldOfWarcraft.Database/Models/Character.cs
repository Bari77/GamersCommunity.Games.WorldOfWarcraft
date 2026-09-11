using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

public partial class Character : IKeyTable
{
    public int Id { get; set; }

    public Guid PublicId { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public string Pseudo { get; set; } = null!;

    public int Level { get; set; }

    public int Ilvl { get; set; }

    public int Achievement { get; set; }

    public string? Sentence { get; set; }

    public bool Main { get; set; }

    public int IdRace { get; set; }

    public int IdPlayer { get; set; }

    public int IdDirection { get; set; }

    public int IdServer { get; set; }

    public int? IdAlignment { get; set; }

    public int? IdMainSpecializationClass { get; set; }

    public int? IdSecondarySpecializationClass { get; set; }

    public virtual ICollection<CharacterJob> CharacterJobs { get; set; } = new List<CharacterJob>();

    public virtual ICollection<EventParticipant> EventParticipants { get; set; } = new List<EventParticipant>();

    public virtual ICollection<Event> Events { get; set; } = new List<Event>();

    /// <summary>
    /// Guilds this character leads, through <see cref="Guild.IdLeader"/>.
    /// </summary>
    public virtual ICollection<Guild> Guilds { get; set; } = new List<Guild>();

    public virtual ICollection<GuildMember> GuildMembers { get; set; } = new List<GuildMember>();

    public virtual ICollection<GuildApplication> GuildApplications { get; set; } = new List<GuildApplication>();

    public virtual Alignment? IdAlignmentNavigation { get; set; }

    public virtual Direction IdDirectionNavigation { get; set; } = null!;

    public virtual SpecializationClass? IdMainSpecializationClassNavigation { get; set; }

    public virtual Player IdPlayerNavigation { get; set; } = null!;

    public virtual Race IdRaceNavigation { get; set; } = null!;

    public virtual SpecializationClass? IdSecondarySpecializationClassNavigation { get; set; }

    public virtual Server IdServerNavigation { get; set; } = null!;

    public virtual ICollection<RosterMember> RosterMembers { get; set; } = new List<RosterMember>();
}
