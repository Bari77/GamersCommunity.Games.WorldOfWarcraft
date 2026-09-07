using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorldOfWarcraft.Database.Migrations
{
    /// <inheritdoc />
    public partial class PlayerPlatformIdentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "IdKeycloak",
                table: "Players",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "PlatformUserPublicId",
                table: "Players",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Players_IdKeycloak",
                table: "Players",
                column: "IdKeycloak",
                unique: true,
                filter: "[IdKeycloak] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Players_PlatformUserPublicId",
                table: "Players",
                column: "PlatformUserPublicId",
                unique: true,
                filter: "[PlatformUserPublicId] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Players_IdKeycloak",
                table: "Players");

            migrationBuilder.DropIndex(
                name: "IX_Players_PlatformUserPublicId",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "IdKeycloak",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "PlatformUserPublicId",
                table: "Players");
        }
    }
}
