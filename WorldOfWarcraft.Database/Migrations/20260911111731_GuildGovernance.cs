using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorldOfWarcraft.Database.Migrations
{
    /// <inheritdoc />
    public partial class GuildGovernance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Characters.IdGuild used to duplicate the membership held by GuildMember. Before dropping
            // it, promote any row that only existed there, so no member is silently kicked out. The
            // rank is derived from Guilds.IdLeader, the only other membership signal the old schema had.
            migrationBuilder.Sql("""
                INSERT INTO [GuildMember] ([IdGuild], [IdCharacter], [IdGuildRank], [CreationDate], [ModificationDate])
                SELECT
                    c.[IdGuild],
                    c.[Id],
                    CASE WHEN g.[IdLeader] = c.[Id]
                         THEN (SELECT TOP 1 [Id] FROM [GuildRank] WHERE [Entitled] = 'leader')
                         ELSE (SELECT TOP 1 [Id] FROM [GuildRank] WHERE [Entitled] = 'member')
                    END,
                    GETDATE(),
                    GETDATE()
                FROM [Characters] c
                INNER JOIN [Guilds] g ON g.[Id] = c.[IdGuild]
                WHERE c.[IdGuild] IS NOT NULL
                  AND NOT EXISTS (SELECT 1 FROM [GuildMember] m WHERE m.[IdCharacter] = c.[Id])
                  AND EXISTS (SELECT 1 FROM [GuildRank] WHERE [Entitled] = 'leader')
                  AND EXISTS (SELECT 1 FROM [GuildRank] WHERE [Entitled] = 'member');
                """);

            migrationBuilder.DropForeignKey(
                name: "FK_Character_Guild",
                table: "Characters");

            migrationBuilder.DropTable(
                name: "GuildMessages");

            migrationBuilder.DropTable(
                name: "GuildRequest");

            migrationBuilder.DropIndex(
                name: "IX_GamePost_IdGuild",
                table: "GamePost");

            migrationBuilder.DropIndex(
                name: "IX_Characters_IdGuild",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "IdGuild",
                table: "Characters");

            migrationBuilder.AddColumn<int>(
                name: "IdModerator",
                table: "GamePost",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModeratedAt",
                table: "GamePost",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ModerationReason",
                table: "GamePost",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "GuildApplicationStatus",
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
                    table.PrimaryKey("PK_GuildApplicationStatus", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GuildApplication",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    IdGuild = table.Column<int>(type: "int", nullable: false),
                    IdCharacter = table.Column<int>(type: "int", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    IdStatus = table.Column<int>(type: "int", nullable: false),
                    IdReviewer = table.Column<int>(type: "int", nullable: true),
                    ReviewedAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildApplication", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildApplication_Character",
                        column: x => x.IdCharacter,
                        principalTable: "Characters",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuildApplication_Guild",
                        column: x => x.IdGuild,
                        principalTable: "Guilds",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuildApplication_Reviewer",
                        column: x => x.IdReviewer,
                        principalTable: "Characters",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuildApplication_Status",
                        column: x => x.IdStatus,
                        principalTable: "GuildApplicationStatus",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_GamePost_GuildWall",
                table: "GamePost",
                columns: new[] { "IdGuild", "IdStatus", "CreationDate" });

            migrationBuilder.CreateIndex(
                name: "IX_GamePost_IdModerator",
                table: "GamePost",
                column: "IdModerator");

            migrationBuilder.CreateIndex(
                name: "IX_GuildApplication_Candidate",
                table: "GuildApplication",
                columns: new[] { "IdCharacter", "IdStatus" });

            migrationBuilder.CreateIndex(
                name: "IX_GuildApplication_IdReviewer",
                table: "GuildApplication",
                column: "IdReviewer");

            migrationBuilder.CreateIndex(
                name: "IX_GuildApplication_IdStatus",
                table: "GuildApplication",
                column: "IdStatus");

            migrationBuilder.CreateIndex(
                name: "IX_GuildApplication_PublicId",
                table: "GuildApplication",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildApplication_Review",
                table: "GuildApplication",
                columns: new[] { "IdGuild", "IdStatus" });

            migrationBuilder.AddForeignKey(
                name: "FK_GamePost_Moderator",
                table: "GamePost",
                column: "IdModerator",
                principalTable: "Characters",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GamePost_Moderator",
                table: "GamePost");

            migrationBuilder.DropTable(
                name: "GuildApplication");

            migrationBuilder.DropTable(
                name: "GuildApplicationStatus");

            migrationBuilder.DropIndex(
                name: "IX_GamePost_GuildWall",
                table: "GamePost");

            migrationBuilder.DropIndex(
                name: "IX_GamePost_IdModerator",
                table: "GamePost");

            migrationBuilder.DropColumn(
                name: "IdModerator",
                table: "GamePost");

            migrationBuilder.DropColumn(
                name: "ModeratedAt",
                table: "GamePost");

            migrationBuilder.DropColumn(
                name: "ModerationReason",
                table: "GamePost");

            migrationBuilder.AddColumn<int>(
                name: "IdGuild",
                table: "Characters",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "GuildMessages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdCharacter = table.Column<int>(type: "int", nullable: false),
                    IdGuild = table.Column<int>(type: "int", nullable: false),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    Message = table.Column<string>(type: "text", nullable: false),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildMessages_Characters",
                        column: x => x.IdCharacter,
                        principalTable: "Characters",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuildMessages_Guilds",
                        column: x => x.IdGuild,
                        principalTable: "Guilds",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "GuildRequest",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    IdGuild = table.Column<int>(type: "int", nullable: false),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    Request = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildRequest", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildRequest_Guilds",
                        column: x => x.IdGuild,
                        principalTable: "Guilds",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_GamePost_IdGuild",
                table: "GamePost",
                column: "IdGuild");

            migrationBuilder.CreateIndex(
                name: "IX_Characters_IdGuild",
                table: "Characters",
                column: "IdGuild");

            migrationBuilder.CreateIndex(
                name: "IX_GuildMessages_IdCharacter",
                table: "GuildMessages",
                column: "IdCharacter");

            migrationBuilder.CreateIndex(
                name: "IX_GuildMessages_IdGuild",
                table: "GuildMessages",
                column: "IdGuild");

            migrationBuilder.CreateIndex(
                name: "IX_GuildMessages_PublicId",
                table: "GuildMessages",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildRequest_IdGuild",
                table: "GuildRequest",
                column: "IdGuild");

            migrationBuilder.CreateIndex(
                name: "IX_GuildRequest_PublicId",
                table: "GuildRequest",
                column: "PublicId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Character_Guild",
                table: "Characters",
                column: "IdGuild",
                principalTable: "Guilds",
                principalColumn: "Id");

            // Mirror the memberships back into the restored column so a rollback keeps showing guilds.
            migrationBuilder.Sql("""
                UPDATE c
                SET c.[IdGuild] = m.[IdGuild]
                FROM [Characters] c
                INNER JOIN [GuildMember] m ON m.[IdCharacter] = c.[Id];
                """);
        }
    }
}
