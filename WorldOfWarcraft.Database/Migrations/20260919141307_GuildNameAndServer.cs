using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorldOfWarcraft.Database.Migrations
{
    /// <inheritdoc />
    public partial class GuildNameAndServer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IdServer",
                table: "Guilds",
                type: "int",
                nullable: true);

            // Existing guilds inherit the leader's realm so the foreign key below can be created.
            migrationBuilder.Sql("""
                UPDATE [Guilds]
                SET [IdServer] = [Characters].[IdServer]
                FROM [Guilds]
                INNER JOIN [Characters] ON [Characters].[Id] = [Guilds].[IdLeader];
                """);

            migrationBuilder.AlterColumn<int>(
                name: "IdServer",
                table: "Guilds",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Guilds_IdServer",
                table: "Guilds",
                column: "IdServer");

            migrationBuilder.AddForeignKey(
                name: "FK_Guilds_Servers",
                table: "Guilds",
                column: "IdServer",
                principalTable: "Servers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Guilds_Servers",
                table: "Guilds");

            migrationBuilder.DropIndex(
                name: "IX_Guilds_IdServer",
                table: "Guilds");

            migrationBuilder.DropColumn(
                name: "IdServer",
                table: "Guilds");
        }
    }
}
