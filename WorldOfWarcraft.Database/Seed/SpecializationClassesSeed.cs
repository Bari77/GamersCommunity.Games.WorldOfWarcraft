using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Database.Seed;

public sealed class SpecializationClassesSeed : KeyTableSeed<WorldOfWarcraftDbContext, SpecializationClass>
{
    public override int Order => 1;

    protected override string TableName => nameof(WorldOfWarcraftDbContext.SpecializationClasses);

    protected override DbSet<SpecializationClass> GetSet(WorldOfWarcraftDbContext db) => db.SpecializationClasses;

    protected override IReadOnlyList<SpecializationClass> Rows { get; } =
    [
        new() { Id = 1, Entitled = "warrior_arms", IdClass = 1, IdSpecialization = 1, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 2, Entitled = "warrior_fury", IdClass = 1, IdSpecialization = 2, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 3, Entitled = "warrior_protection", IdClass = 1, IdSpecialization = 3, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },

        new() { Id = 4, Entitled = "paladin_holy", IdClass = 2, IdSpecialization = 4, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 5, Entitled = "paladin_protection", IdClass = 2, IdSpecialization = 3, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 6, Entitled = "paladin_retribution", IdClass = 2, IdSpecialization = 5, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },

        new() { Id = 7, Entitled = "hunter_beast_mastery", IdClass = 3, IdSpecialization = 8, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 8, Entitled = "hunter_marksmanship", IdClass = 3, IdSpecialization = 9, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 9, Entitled = "hunter_survival", IdClass = 3, IdSpecialization = 10, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },

        new() { Id = 10, Entitled = "rogue_assassination", IdClass = 4, IdSpecialization = 11, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 11, Entitled = "rogue_outlaw", IdClass = 4, IdSpecialization = 12, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 12, Entitled = "rogue_subtlety", IdClass = 4, IdSpecialization = 13, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },

        new() { Id = 13, Entitled = "priest_discipline", IdClass = 5, IdSpecialization = 6, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 14, Entitled = "priest_holy", IdClass = 5, IdSpecialization = 4, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 15, Entitled = "priest_shadow", IdClass = 5, IdSpecialization = 7, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },

        new() { Id = 16, Entitled = "shaman_elemental", IdClass = 6, IdSpecialization = 14, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 17, Entitled = "shaman_enhancement", IdClass = 6, IdSpecialization = 15, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 18, Entitled = "shaman_restoration", IdClass = 6, IdSpecialization = 16, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },

        new() { Id = 19, Entitled = "mage_arcane", IdClass = 7, IdSpecialization = 17, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 20, Entitled = "mage_fire", IdClass = 7, IdSpecialization = 18, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 21, Entitled = "mage_frost", IdClass = 7, IdSpecialization = 19, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },

        new() { Id = 22, Entitled = "warlock_affliction", IdClass = 8, IdSpecialization = 20, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 23, Entitled = "warlock_demonology", IdClass = 8, IdSpecialization = 21, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 24, Entitled = "warlock_destruction", IdClass = 8, IdSpecialization = 22, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },

        new() { Id = 25, Entitled = "monk_brewmaster", IdClass = 9, IdSpecialization = 23, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 26, Entitled = "monk_mistweaver", IdClass = 9, IdSpecialization = 24, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 27, Entitled = "monk_windwalker", IdClass = 9, IdSpecialization = 25, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },

        new() { Id = 28, Entitled = "druid_balance", IdClass = 10, IdSpecialization = 26, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 29, Entitled = "druid_feral", IdClass = 10, IdSpecialization = 27, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 30, Entitled = "druid_guardian", IdClass = 10, IdSpecialization = 28, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 31, Entitled = "druid_restoration", IdClass = 10, IdSpecialization = 16, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },

        new() { Id = 32, Entitled = "demon_hunter_havoc", IdClass = 11, IdSpecialization = 29, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 33, Entitled = "demon_hunter_vengeance", IdClass = 11, IdSpecialization = 30, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },

        new() { Id = 34, Entitled = "death_knight_blood", IdClass = 12, IdSpecialization = 31, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 35, Entitled = "death_knight_frost", IdClass = 12, IdSpecialization = 19, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 36, Entitled = "death_knight_unholy", IdClass = 12, IdSpecialization = 32, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },

        new() { Id = 37, Entitled = "evoker_devastation", IdClass = 13, IdSpecialization = 33, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 38, Entitled = "evoker_preservation", IdClass = 13, IdSpecialization = 34, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 39, Entitled = "evoker_augmentation", IdClass = 13, IdSpecialization = 35, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
    ];
}
