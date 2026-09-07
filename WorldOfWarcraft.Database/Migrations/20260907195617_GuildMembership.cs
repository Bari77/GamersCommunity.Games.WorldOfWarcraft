using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorldOfWarcraft.Database.Migrations
{
    /// <inheritdoc />
    public partial class GuildMembership : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "Guilds",
                type: "nvarchar(4)",
                maxLength: 4,
                nullable: false,
                defaultValue: "");

            // Existing guilds land on an empty discriminator, which UQ_Guild_Handle would reject as
            // soon as two of them share a name. Number them per name before creating the index.
            migrationBuilder.Sql("""
                WITH numbered AS (
                    SELECT Id, ROW_NUMBER() OVER (PARTITION BY Entitled ORDER BY Id) AS Rn
                    FROM Guilds
                )
                UPDATE g
                SET Discriminator = RIGHT('0000' + CAST(n.Rn AS varchar(4)), 4)
                FROM Guilds g
                INNER JOIN numbered n ON n.Id = g.Id;
                """);

            migrationBuilder.CreateTable(
                name: "GuildRank",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    Entitled = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildRank", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GuildMember",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    IdGuild = table.Column<int>(type: "int", nullable: false),
                    IdCharacter = table.Column<int>(type: "int", nullable: false),
                    IdGuildRank = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildMember", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildMember_Character",
                        column: x => x.IdCharacter,
                        principalTable: "Characters",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuildMember_Guild",
                        column: x => x.IdGuild,
                        principalTable: "Guilds",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuildMember_GuildRank",
                        column: x => x.IdGuildRank,
                        principalTable: "GuildRank",
                        principalColumn: "Id");
                });

            // Ranks are also declared in GuildRanksSeed, which stays idempotent. They are inserted
            // here so the GuildMember backfill below has a valid foreign key to point at.
            migrationBuilder.InsertData(
                table: "GuildRank",
                columns: new[] { "Id", "CreationDate", "ModificationDate", "Entitled" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 6, 13, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 6, 13, 0, 0, 0, DateTimeKind.Utc), "leader" },
                    { 2, new DateTime(2026, 6, 13, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 6, 13, 0, 0, 0, DateTimeKind.Utc), "officer" },
                    { 3, new DateTime(2026, 6, 13, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 6, 13, 0, 0, 0, DateTimeKind.Utc), "member" },
                });

            migrationBuilder.CreateIndex(
                name: "UQ_Guild_Handle",
                table: "Guilds",
                columns: new[] { "Entitled", "Discriminator" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildMember_IdCharacter",
                table: "GuildMember",
                column: "IdCharacter");

            migrationBuilder.CreateIndex(
                name: "IX_GuildMember_IdGuildRank",
                table: "GuildMember",
                column: "IdGuildRank");

            migrationBuilder.CreateIndex(
                name: "IX_GuildMember_PublicId",
                table: "GuildMember",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_GuildMember_Character",
                table: "GuildMember",
                columns: new[] { "IdGuild", "IdCharacter" },
                unique: true);

            // Carry over the membership already held by Character.IdGuild so existing guilds keep
            // their roster. The guild leader is the only one that can be promoted automatically.
            migrationBuilder.Sql("""
                INSERT INTO GuildMember (IdGuild, IdCharacter, IdGuildRank)
                SELECT c.IdGuild, c.Id, CASE WHEN g.IdLeader = c.Id THEN 1 ELSE 3 END
                FROM Characters c
                INNER JOIN Guilds g ON g.Id = c.IdGuild
                WHERE c.IdGuild IS NOT NULL;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GuildMember");

            migrationBuilder.DropTable(
                name: "GuildRank");

            migrationBuilder.DropIndex(
                name: "UQ_Guild_Handle",
                table: "Guilds");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "Guilds");
        }
    }
}
