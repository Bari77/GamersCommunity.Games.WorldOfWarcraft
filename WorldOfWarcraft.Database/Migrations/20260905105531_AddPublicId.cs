using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorldOfWarcraft.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddPublicId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "PublicId",
                table: "Rosters",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWSEQUENTIALID()");

            migrationBuilder.AddColumn<Guid>(
                name: "PublicId",
                table: "RosterMembers",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWSEQUENTIALID()");

            migrationBuilder.AddColumn<Guid>(
                name: "PublicId",
                table: "PlayerVip",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWSEQUENTIALID()");

            migrationBuilder.AddColumn<Guid>(
                name: "PublicId",
                table: "PlayerVideos",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWSEQUENTIALID()");

            migrationBuilder.AddColumn<Guid>(
                name: "PublicId",
                table: "PlayerStream",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWSEQUENTIALID()");

            migrationBuilder.AddColumn<Guid>(
                name: "PublicId",
                table: "Players",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWSEQUENTIALID()");

            migrationBuilder.AddColumn<Guid>(
                name: "PublicId",
                table: "PlayerRank",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWSEQUENTIALID()");

            migrationBuilder.AddColumn<Guid>(
                name: "PublicId",
                table: "PlayerPictures",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWSEQUENTIALID()");

            migrationBuilder.AddColumn<Guid>(
                name: "PublicId",
                table: "PlayerLinks",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWSEQUENTIALID()");

            migrationBuilder.AddColumn<Guid>(
                name: "PublicId",
                table: "PlayerAnnouncements",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWSEQUENTIALID()");

            migrationBuilder.AddColumn<Guid>(
                name: "PublicId",
                table: "GuildVip",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWSEQUENTIALID()");

            migrationBuilder.AddColumn<Guid>(
                name: "PublicId",
                table: "Guilds",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWSEQUENTIALID()");

            migrationBuilder.AddColumn<Guid>(
                name: "PublicId",
                table: "GuildRequest",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWSEQUENTIALID()");

            migrationBuilder.AddColumn<Guid>(
                name: "PublicId",
                table: "GuildMessages",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWSEQUENTIALID()");

            migrationBuilder.AddColumn<Guid>(
                name: "PublicId",
                table: "GuildLinks",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWSEQUENTIALID()");

            migrationBuilder.AddColumn<Guid>(
                name: "PublicId",
                table: "GuildAnnouncements",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWSEQUENTIALID()");

            migrationBuilder.AddColumn<Guid>(
                name: "PublicId",
                table: "Events",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWSEQUENTIALID()");

            migrationBuilder.AddColumn<Guid>(
                name: "PublicId",
                table: "EventParticipants",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWSEQUENTIALID()");

            migrationBuilder.AddColumn<Guid>(
                name: "PublicId",
                table: "Characters",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWSEQUENTIALID()");

            migrationBuilder.AddColumn<Guid>(
                name: "PublicId",
                table: "CharacterJob",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWSEQUENTIALID()");

            migrationBuilder.CreateIndex(
                name: "IX_Rosters_PublicId",
                table: "Rosters",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RosterMembers_PublicId",
                table: "RosterMembers",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PlayerVip_PublicId",
                table: "PlayerVip",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PlayerVideos_PublicId",
                table: "PlayerVideos",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PlayerStream_PublicId",
                table: "PlayerStream",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Players_PublicId",
                table: "Players",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PlayerRank_PublicId",
                table: "PlayerRank",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PlayerPictures_PublicId",
                table: "PlayerPictures",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PlayerLinks_PublicId",
                table: "PlayerLinks",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PlayerAnnouncements_PublicId",
                table: "PlayerAnnouncements",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildVip_PublicId",
                table: "GuildVip",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Guilds_PublicId",
                table: "Guilds",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildRequest_PublicId",
                table: "GuildRequest",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildMessages_PublicId",
                table: "GuildMessages",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildLinks_PublicId",
                table: "GuildLinks",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuildAnnouncements_PublicId",
                table: "GuildAnnouncements",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Events_PublicId",
                table: "Events",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EventParticipants_PublicId",
                table: "EventParticipants",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Characters_PublicId",
                table: "Characters",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CharacterJob_PublicId",
                table: "CharacterJob",
                column: "PublicId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Rosters_PublicId",
                table: "Rosters");

            migrationBuilder.DropIndex(
                name: "IX_RosterMembers_PublicId",
                table: "RosterMembers");

            migrationBuilder.DropIndex(
                name: "IX_PlayerVip_PublicId",
                table: "PlayerVip");

            migrationBuilder.DropIndex(
                name: "IX_PlayerVideos_PublicId",
                table: "PlayerVideos");

            migrationBuilder.DropIndex(
                name: "IX_PlayerStream_PublicId",
                table: "PlayerStream");

            migrationBuilder.DropIndex(
                name: "IX_Players_PublicId",
                table: "Players");

            migrationBuilder.DropIndex(
                name: "IX_PlayerRank_PublicId",
                table: "PlayerRank");

            migrationBuilder.DropIndex(
                name: "IX_PlayerPictures_PublicId",
                table: "PlayerPictures");

            migrationBuilder.DropIndex(
                name: "IX_PlayerLinks_PublicId",
                table: "PlayerLinks");

            migrationBuilder.DropIndex(
                name: "IX_PlayerAnnouncements_PublicId",
                table: "PlayerAnnouncements");

            migrationBuilder.DropIndex(
                name: "IX_GuildVip_PublicId",
                table: "GuildVip");

            migrationBuilder.DropIndex(
                name: "IX_Guilds_PublicId",
                table: "Guilds");

            migrationBuilder.DropIndex(
                name: "IX_GuildRequest_PublicId",
                table: "GuildRequest");

            migrationBuilder.DropIndex(
                name: "IX_GuildMessages_PublicId",
                table: "GuildMessages");

            migrationBuilder.DropIndex(
                name: "IX_GuildLinks_PublicId",
                table: "GuildLinks");

            migrationBuilder.DropIndex(
                name: "IX_GuildAnnouncements_PublicId",
                table: "GuildAnnouncements");

            migrationBuilder.DropIndex(
                name: "IX_Events_PublicId",
                table: "Events");

            migrationBuilder.DropIndex(
                name: "IX_EventParticipants_PublicId",
                table: "EventParticipants");

            migrationBuilder.DropIndex(
                name: "IX_Characters_PublicId",
                table: "Characters");

            migrationBuilder.DropIndex(
                name: "IX_CharacterJob_PublicId",
                table: "CharacterJob");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "Rosters");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "RosterMembers");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "PlayerVip");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "PlayerVideos");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "PlayerStream");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "PlayerRank");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "PlayerPictures");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "PlayerLinks");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "PlayerAnnouncements");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "GuildVip");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "Guilds");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "GuildRequest");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "GuildMessages");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "GuildLinks");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "GuildAnnouncements");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "EventParticipants");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "CharacterJob");
        }
    }
}
