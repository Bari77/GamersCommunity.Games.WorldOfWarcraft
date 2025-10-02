using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

public partial class Event : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public string Entitled { get; set; } = null!;

    public int? MinimumLevel { get; set; }

    public DateTime DateHourBegin { get; set; }

    public DateTime DateHourEnd { get; set; }

    public string Description { get; set; } = null!;

    public string Location { get; set; } = null!;

    public string Picture { get; set; } = null!;

    public int Places { get; set; }

    public bool EventGuild { get; set; }

    public int? IdAlignments { get; set; }

    public int? IdOrganizer { get; set; }

    public virtual ICollection<EventParticipant> EventParticipants { get; set; } = new List<EventParticipant>();

    public virtual Alignment? IdAlignmentsNavigation { get; set; }

    public virtual Character? IdOrganizerNavigation { get; set; }
}
