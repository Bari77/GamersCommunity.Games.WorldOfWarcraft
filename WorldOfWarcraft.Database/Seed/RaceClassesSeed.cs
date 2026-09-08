using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Database.Seed;

public sealed class RaceClassesSeed : KeyTableSeed<WorldOfWarcraftDbContext, RaceClass>
{
    private const int Human = 1;
    private const int Orc = 2;
    private const int Dwarf = 3;
    private const int NightElf = 4;
    private const int Undead = 5;
    private const int Tauren = 6;
    private const int Gnome = 7;
    private const int Troll = 8;
    private const int BloodElf = 9;
    private const int Draenei = 10;
    private const int Worgen = 11;
    private const int Goblin = 12;
    private const int Pandaren = 13;
    private const int Vulpera = 14;
    private const int Dracthyr = 15;

    private static readonly int[] AllButDracthyr =
        [Human, Orc, Dwarf, NightElf, Undead, Tauren, Gnome, Troll, BloodElf, Draenei, Worgen, Goblin, Pandaren, Vulpera];

    private static readonly (int ClassId, int[] RaceIds)[] Matrix =
    [
        (1, AllButDracthyr),
        (2, [Human, Dwarf, Tauren, BloodElf, Draenei]),
        (3, AllButDracthyr),
        (4, [Human, Orc, Dwarf, NightElf, Undead, Gnome, Troll, BloodElf, Draenei, Worgen, Goblin, Pandaren, Vulpera]),
        (5, [Human, Dwarf, NightElf, Undead, Tauren, Gnome, Troll, BloodElf, Draenei, Worgen, Goblin, Pandaren, Vulpera]),
        (6, [Orc, Dwarf, Tauren, Troll, Draenei, Goblin, Pandaren, Vulpera]),
        (7, AllButDracthyr),
        (8, [Human, Orc, Dwarf, Undead, Gnome, Troll, BloodElf, Worgen, Goblin, Vulpera]),
        (9, [Human, Orc, Dwarf, NightElf, Undead, Tauren, Gnome, Troll, BloodElf, Draenei, Pandaren, Vulpera]),
        (10, [NightElf, Tauren, Troll, Worgen]),
        (11, [NightElf, BloodElf]),
        (12, AllButDracthyr),
        (13, [Dracthyr]),
    ];

    public override int Order => 1;

    protected override string TableName => nameof(WorldOfWarcraftDbContext.RaceClasses);

    protected override DbSet<RaceClass> GetSet(WorldOfWarcraftDbContext db) => db.RaceClasses;

    protected override IReadOnlyList<RaceClass> Rows { get; } = Build();

    private static IReadOnlyList<RaceClass> Build() =>
    [
        .. from pair in Matrix
           from raceId in pair.RaceIds
           select new RaceClass
           {
               Id = (pair.ClassId * 100) + raceId,
               IdClass = pair.ClassId,
               IdRace = raceId,
               CreationDate = SeedDates.Utc,
               ModificationDate = SeedDates.Utc,
           },
    ];
}
