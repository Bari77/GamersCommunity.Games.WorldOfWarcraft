using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace WorldOfWarcraft.Database.Migrations
{
    /// <inheritdoc />
    public partial class SeedReferenceData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Alignments",
                columns: new[] { "Id", "CreationDate", "Entitled", "ModificationDate" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "ALLIANCE", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "HORDE", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "Classes",
                columns: new[] { "Id", "CreationDate", "Entitled", "ModificationDate" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "WARRIOR", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "PALADIN", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "HUNTER", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 4, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "ROGUE", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 5, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "PRIEST", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 6, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "SHAMAN", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 7, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "MAGE", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 8, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "WARLOCK", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 9, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "MONK", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 10, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "DRUID", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 11, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "DEMON_HUNTER", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 12, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "DEATH_KNIGHT", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 13, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "EVOKER", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "Directions",
                columns: new[] { "Id", "CreationDate", "Entitled", "ModificationDate" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "TANK", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "HEAL", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "DPS", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "Jobs",
                columns: new[] { "Id", "CreationDate", "Entitled", "ModificationDate" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "MINING", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "HERBALISM", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "SKINNING", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 4, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "BLACKSMITHING", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 5, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "TAILORING", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 6, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "JEWELCRAFTING", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 7, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "ENCHANTING", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 8, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "INSCRIPTION", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 9, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "ENGINEERING", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 10, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "ALCHEMY", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 11, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "COOKING", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 12, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "FISHING", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "Races",
                columns: new[] { "Id", "CreationDate", "Entitled", "ModificationDate" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "HUMAN", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "ORC", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "DWARF", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 4, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "NIGHT_ELF", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 5, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "UNDEAD", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 6, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "TAUREN", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 7, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "GNOME", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 8, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "TROLL", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 9, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "BLOOD_ELF", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 10, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "DRAENEI", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 11, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "WORGEN", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 12, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "GOBLIN", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 13, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "PANDAREN", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 14, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "VULPERA", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 15, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "DRACTHYR", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "Servers",
                columns: new[] { "Id", "CreationDate", "Entitled", "IdLocale", "ModificationDate" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "ARCHIMONDE", 3, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "KHAZ_MODAN", 3, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "HYJAL", 3, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 4, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "ILLIDAN", 3, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "Specializations",
                columns: new[] { "Id", "CreationDate", "Entitled", "ModificationDate" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "ARMS", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "FURY", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "PROTECTION", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 4, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "HOLY", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 5, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "RETRIBUTION", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 6, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "DISCIPLINE", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 7, new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc), "SHADOW", new DateTime(2026, 6, 13, 0, 0, 0, 0, DateTimeKind.Utc) }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Alignments",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Alignments",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Classes",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Classes",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Classes",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Classes",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Classes",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Classes",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Classes",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Classes",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Classes",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Classes",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Classes",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Classes",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Classes",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Directions",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Directions",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Directions",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Jobs",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Jobs",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Jobs",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Jobs",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Jobs",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Jobs",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Jobs",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Jobs",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Jobs",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Jobs",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Jobs",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Jobs",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Races",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Races",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Races",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Races",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Races",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Races",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Races",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Races",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Races",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Races",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Races",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Races",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Races",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Races",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Races",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Servers",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Servers",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Servers",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Servers",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Specializations",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Specializations",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Specializations",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Specializations",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Specializations",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Specializations",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Specializations",
                keyColumn: "Id",
                keyValue: 7);
        }
    }
}
