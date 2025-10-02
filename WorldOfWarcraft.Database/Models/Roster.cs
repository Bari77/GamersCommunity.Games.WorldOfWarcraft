using GamersCommunity.Core.Database;

namespace WorldOfWarcraft.Database.Models;

public partial class Roster : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public int Number { get; set; }

    public int IdDirection { get; set; }

    public int IdGuild { get; set; }

    public virtual Direction IdDirectionNavigation { get; set; } = null!;

    public virtual Guild IdGuildNavigation { get; set; } = null!;

    public virtual ICollection<RosterMember> RosterMembers { get; set; } = new List<RosterMember>();
}
