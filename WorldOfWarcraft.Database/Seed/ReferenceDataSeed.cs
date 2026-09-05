using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Database.Seed;

/// <summary>
/// World of Warcraft reference data. <c>Entitled</c> fields are i18n keys (EN, uppercase).
/// <c>IdLocale</c> references a technical id (Blizzard), not an i18n key.
/// </summary>
public static class ReferenceDataSeed
{
    private static readonly DateTime SeedDate = new(2026, 6, 13, 0, 0, 0, DateTimeKind.Utc);

    public static void Apply(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Alignment>().HasData(
            new Alignment { Id = 1, Entitled = "ALLIANCE", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Alignment { Id = 2, Entitled = "HORDE", CreationDate = SeedDate, ModificationDate = SeedDate });

        modelBuilder.Entity<Direction>().HasData(
            new Direction { Id = 1, Entitled = "TANK", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Direction { Id = 2, Entitled = "HEAL", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Direction { Id = 3, Entitled = "DPS", CreationDate = SeedDate, ModificationDate = SeedDate });

        modelBuilder.Entity<Class>().HasData(
            new Class { Id = 1, Entitled = "WARRIOR", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Class { Id = 2, Entitled = "PALADIN", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Class { Id = 3, Entitled = "HUNTER", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Class { Id = 4, Entitled = "ROGUE", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Class { Id = 5, Entitled = "PRIEST", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Class { Id = 6, Entitled = "SHAMAN", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Class { Id = 7, Entitled = "MAGE", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Class { Id = 8, Entitled = "WARLOCK", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Class { Id = 9, Entitled = "MONK", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Class { Id = 10, Entitled = "DRUID", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Class { Id = 11, Entitled = "DEMON_HUNTER", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Class { Id = 12, Entitled = "DEATH_KNIGHT", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Class { Id = 13, Entitled = "EVOKER", CreationDate = SeedDate, ModificationDate = SeedDate });

        modelBuilder.Entity<Race>().HasData(
            new Race { Id = 1, Entitled = "HUMAN", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Race { Id = 2, Entitled = "ORC", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Race { Id = 3, Entitled = "DWARF", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Race { Id = 4, Entitled = "NIGHT_ELF", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Race { Id = 5, Entitled = "UNDEAD", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Race { Id = 6, Entitled = "TAUREN", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Race { Id = 7, Entitled = "GNOME", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Race { Id = 8, Entitled = "TROLL", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Race { Id = 9, Entitled = "BLOOD_ELF", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Race { Id = 10, Entitled = "DRAENEI", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Race { Id = 11, Entitled = "WORGEN", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Race { Id = 12, Entitled = "GOBLIN", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Race { Id = 13, Entitled = "PANDAREN", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Race { Id = 14, Entitled = "VULPERA", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Race { Id = 15, Entitled = "DRACTHYR", CreationDate = SeedDate, ModificationDate = SeedDate });

        modelBuilder.Entity<Job>().HasData(
            new Job { Id = 1, Entitled = "MINING", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Job { Id = 2, Entitled = "HERBALISM", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Job { Id = 3, Entitled = "SKINNING", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Job { Id = 4, Entitled = "BLACKSMITHING", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Job { Id = 5, Entitled = "TAILORING", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Job { Id = 6, Entitled = "JEWELCRAFTING", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Job { Id = 7, Entitled = "ENCHANTING", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Job { Id = 8, Entitled = "INSCRIPTION", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Job { Id = 9, Entitled = "ENGINEERING", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Job { Id = 10, Entitled = "ALCHEMY", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Job { Id = 11, Entitled = "COOKING", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Job { Id = 12, Entitled = "FISHING", CreationDate = SeedDate, ModificationDate = SeedDate });

        modelBuilder.Entity<Specialization>().HasData(
            new Specialization { Id = 1, Entitled = "ARMS", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Specialization { Id = 2, Entitled = "FURY", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Specialization { Id = 3, Entitled = "PROTECTION", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Specialization { Id = 4, Entitled = "HOLY", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Specialization { Id = 5, Entitled = "RETRIBUTION", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Specialization { Id = 6, Entitled = "DISCIPLINE", CreationDate = SeedDate, ModificationDate = SeedDate },
            new Specialization { Id = 7, Entitled = "SHADOW", CreationDate = SeedDate, ModificationDate = SeedDate });

        modelBuilder.Entity<Server>().HasData(
            new Server { Id = 1, Entitled = "ARCHIMONDE", IdLocale = 3, CreationDate = SeedDate, ModificationDate = SeedDate },
            new Server { Id = 2, Entitled = "KHAZ_MODAN", IdLocale = 3, CreationDate = SeedDate, ModificationDate = SeedDate },
            new Server { Id = 3, Entitled = "HYJAL", IdLocale = 3, CreationDate = SeedDate, ModificationDate = SeedDate },
            new Server { Id = 4, Entitled = "ILLIDAN", IdLocale = 3, CreationDate = SeedDate, ModificationDate = SeedDate });
    }
}
