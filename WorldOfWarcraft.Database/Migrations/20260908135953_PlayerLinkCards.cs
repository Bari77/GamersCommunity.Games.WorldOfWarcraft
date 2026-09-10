using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorldOfWarcraft.Database.Migrations
{
    /// <inheritdoc />
    public partial class PlayerLinkCards : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Icon",
                table: "PlayerLinks",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "Label",
                table: "PlayerLinks",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Position",
                table: "PlayerLinks",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Label",
                table: "PlayerLinks");

            migrationBuilder.DropColumn(
                name: "Position",
                table: "PlayerLinks");

            migrationBuilder.AlterColumn<int>(
                name: "Icon",
                table: "PlayerLinks",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(30)",
                oldMaxLength: 30,
                oldNullable: true);
        }
    }
}
