using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorldOfWarcraft.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddPlayerLayoutJson : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LayoutJson",
                table: "Players",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LayoutJson",
                table: "Players");
        }
    }
}
