using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorldOfWarcraft.Database.Migrations
{
    /// <inheritdoc />
    public partial class SocialLfgAndGamePosts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EventParticipantStatus",
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
                    table.PrimaryKey("PK_EventParticipantStatus", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GamePostStatus",
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
                    table.PrimaryKey("PK_GamePostStatus", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LfgAd",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    IdPlayer = table.Column<int>(type: "int", nullable: false),
                    IdGuild = table.Column<int>(type: "int", nullable: true),
                    Kind = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Body = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    IdServer = table.Column<int>(type: "int", nullable: true),
                    IdDirection = table.Column<int>(type: "int", nullable: true),
                    ExpiresAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LfgAd", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LfgAd_Direction",
                        column: x => x.IdDirection,
                        principalTable: "Directions",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_LfgAd_Guild",
                        column: x => x.IdGuild,
                        principalTable: "Guilds",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_LfgAd_Player",
                        column: x => x.IdPlayer,
                        principalTable: "Players",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_LfgAd_Server",
                        column: x => x.IdServer,
                        principalTable: "Servers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "GamePost",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    IdPlayer = table.Column<int>(type: "int", nullable: false),
                    IdGuild = table.Column<int>(type: "int", nullable: true),
                    Body = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: false),
                    MediaUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    MediaKind = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: true),
                    IdStatus = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GamePost", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GamePost_Guild",
                        column: x => x.IdGuild,
                        principalTable: "Guilds",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GamePost_Player",
                        column: x => x.IdPlayer,
                        principalTable: "Players",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GamePost_Status",
                        column: x => x.IdStatus,
                        principalTable: "GamePostStatus",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_EventParticipants_IdStatus",
                table: "EventParticipants",
                column: "IdStatus");

            migrationBuilder.CreateIndex(
                name: "IX_GamePost_IdGuild",
                table: "GamePost",
                column: "IdGuild");

            migrationBuilder.CreateIndex(
                name: "IX_GamePost_IdPlayer",
                table: "GamePost",
                column: "IdPlayer");

            migrationBuilder.CreateIndex(
                name: "IX_GamePost_IdStatus",
                table: "GamePost",
                column: "IdStatus");

            migrationBuilder.CreateIndex(
                name: "IX_GamePost_PublicId",
                table: "GamePost",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LfgAd_IdDirection",
                table: "LfgAd",
                column: "IdDirection");

            migrationBuilder.CreateIndex(
                name: "IX_LfgAd_IdGuild",
                table: "LfgAd",
                column: "IdGuild");

            migrationBuilder.CreateIndex(
                name: "IX_LfgAd_IdPlayer",
                table: "LfgAd",
                column: "IdPlayer");

            migrationBuilder.CreateIndex(
                name: "IX_LfgAd_IdServer",
                table: "LfgAd",
                column: "IdServer");

            migrationBuilder.CreateIndex(
                name: "IX_LfgAd_PublicId",
                table: "LfgAd",
                column: "PublicId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_EventParticipant_Status",
                table: "EventParticipants",
                column: "IdStatus",
                principalTable: "EventParticipantStatus",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventParticipant_Status",
                table: "EventParticipants");

            migrationBuilder.DropTable(
                name: "EventParticipantStatus");

            migrationBuilder.DropTable(
                name: "GamePost");

            migrationBuilder.DropTable(
                name: "LfgAd");

            migrationBuilder.DropTable(
                name: "GamePostStatus");

            migrationBuilder.DropIndex(
                name: "IX_EventParticipants_IdStatus",
                table: "EventParticipants");
        }
    }
}
