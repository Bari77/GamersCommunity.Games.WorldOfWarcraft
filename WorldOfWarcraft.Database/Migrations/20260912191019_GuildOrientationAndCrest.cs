using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorldOfWarcraft.Database.Migrations
{
    /// <inheritdoc />
    public partial class GuildOrientationAndCrest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GuildOrientations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    Entitled = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildOrientation", x => x.Id);
                });

            // Reference rows normally belong to Seed/GuildOrientationsSeed, which runs after the
            // migrations. Existing guilds need a row to point at before the foreign key below can
            // be created, so the three codes are inserted here too; the seed upserts the same ids.
            migrationBuilder.Sql("""
                SET IDENTITY_INSERT [GuildOrientations] ON;
                INSERT INTO [GuildOrientations] ([Id], [Entitled]) VALUES (1, 'pve'), (2, 'pvp'), (3, 'pvpe');
                SET IDENTITY_INSERT [GuildOrientations] OFF;
                """);

            migrationBuilder.DropForeignKey(
                name: "FK_Guilds_Directions",
                table: "Guilds");

            migrationBuilder.RenameColumn(
                name: "IdMainDirection",
                table: "Guilds",
                newName: "IdOrientation");

            migrationBuilder.RenameIndex(
                name: "IX_Guilds_IdMainDirection",
                table: "Guilds",
                newName: "IX_Guilds_IdOrientation");

            // The column used to hold a role (tank, heal, dps), which says nothing about what a
            // guild plays: every existing guild starts over as pve.
            migrationBuilder.Sql("UPDATE [Guilds] SET [IdOrientation] = 1;");

            migrationBuilder.AddColumn<string>(
                name: "CrestBackgroundColor",
                table: "Guilds",
                type: "nvarchar(7)",
                maxLength: 7,
                nullable: false,
                defaultValue: "#1e2a4a");

            migrationBuilder.AddColumn<int>(
                name: "CrestBorder",
                table: "Guilds",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "CrestBorderColor",
                table: "Guilds",
                type: "nvarchar(7)",
                maxLength: 7,
                nullable: false,
                defaultValue: "#c8a95a");

            migrationBuilder.AddColumn<int>(
                name: "CrestEmblem",
                table: "Guilds",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "CrestEmblemColor",
                table: "Guilds",
                type: "nvarchar(7)",
                maxLength: 7,
                nullable: false,
                defaultValue: "#f0e6c8");

            migrationBuilder.AddForeignKey(
                name: "FK_Guilds_GuildOrientations",
                table: "Guilds",
                column: "IdOrientation",
                principalTable: "GuildOrientations",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Guilds_GuildOrientations",
                table: "Guilds");

            migrationBuilder.DropColumn(
                name: "CrestBackgroundColor",
                table: "Guilds");

            migrationBuilder.DropColumn(
                name: "CrestBorder",
                table: "Guilds");

            migrationBuilder.DropColumn(
                name: "CrestBorderColor",
                table: "Guilds");

            migrationBuilder.DropColumn(
                name: "CrestEmblem",
                table: "Guilds");

            migrationBuilder.DropColumn(
                name: "CrestEmblemColor",
                table: "Guilds");

            migrationBuilder.RenameColumn(
                name: "IdOrientation",
                table: "Guilds",
                newName: "IdMainDirection");

            migrationBuilder.RenameIndex(
                name: "IX_Guilds_IdOrientation",
                table: "Guilds",
                newName: "IX_Guilds_IdMainDirection");

            // Orientation ids are meaningless as roles: fall back to the first seeded direction.
            migrationBuilder.Sql("UPDATE [Guilds] SET [IdMainDirection] = 1;");

            migrationBuilder.DropTable(
                name: "GuildOrientations");

            migrationBuilder.AddForeignKey(
                name: "FK_Guilds_Directions",
                table: "Guilds",
                column: "IdMainDirection",
                principalTable: "Directions",
                principalColumn: "Id");
        }
    }
}
