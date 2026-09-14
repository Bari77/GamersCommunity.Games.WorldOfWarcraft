using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorldOfWarcraft.Database.Migrations
{
    /// <inheritdoc />
    public partial class GuildWorkspaceAndPostVisibility : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LayoutJson",
                table: "Guilds",
                type: "nvarchar(max)",
                nullable: true);

            // GuildLinks catches up with PlayerLinks: a labelled, ordered card rather than a bare URL.
            migrationBuilder.RenameColumn(
                name: "Link",
                table: "GuildLinks",
                newName: "Url");

            migrationBuilder.AlterColumn<string>(
                name: "Icon",
                table: "GuildLinks",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Label",
                table: "GuildLinks",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Position",
                table: "GuildLinks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            // The two hard-coded links become ordinary cards, so the links widget owns them all.
            // Runs before the columns go, and skips guilds that already pinned the same address.
            migrationBuilder.Sql("""
                INSERT INTO [GuildLinks] ([IdGuild], [Url], [Label], [Icon], [Position], [CreationDate], [ModificationDate])
                SELECT g.[Id], LTRIM(RTRIM(g.[LinkDiscord])), 'Discord', 'discord', 0, GETDATE(), GETDATE()
                FROM [Guilds] g
                WHERE g.[LinkDiscord] IS NOT NULL
                  AND LTRIM(RTRIM(g.[LinkDiscord])) <> ''
                  AND NOT EXISTS (
                      SELECT 1 FROM [GuildLinks] l
                      WHERE l.[IdGuild] = g.[Id] AND CAST(l.[Url] AS nvarchar(500)) = LTRIM(RTRIM(g.[LinkDiscord])));

                INSERT INTO [GuildLinks] ([IdGuild], [Url], [Label], [Icon], [Position], [CreationDate], [ModificationDate])
                SELECT g.[Id], LTRIM(RTRIM(g.[LinkForum])), 'Forum', NULL, 1, GETDATE(), GETDATE()
                FROM [Guilds] g
                WHERE g.[LinkForum] IS NOT NULL
                  AND LTRIM(RTRIM(g.[LinkForum])) <> ''
                  AND NOT EXISTS (
                      SELECT 1 FROM [GuildLinks] l
                      WHERE l.[IdGuild] = g.[Id] AND CAST(l.[Url] AS nvarchar(500)) = LTRIM(RTRIM(g.[LinkForum])));
                """);

            migrationBuilder.DropColumn(
                name: "LinkDiscord",
                table: "Guilds");

            migrationBuilder.DropColumn(
                name: "LinkForum",
                table: "Guilds");

            // Null reads as "public"; any other value is the lowest rank allowed to open the post.
            migrationBuilder.AddColumn<int>(
                name: "IdMinimumRank",
                table: "GamePost",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_GamePost_IdMinimumRank",
                table: "GamePost",
                column: "IdMinimumRank");

            migrationBuilder.AddForeignKey(
                name: "FK_GamePost_MinimumRank",
                table: "GamePost",
                column: "IdMinimumRank",
                principalTable: "GuildRank",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GamePost_MinimumRank",
                table: "GamePost");

            migrationBuilder.DropIndex(
                name: "IX_GamePost_IdMinimumRank",
                table: "GamePost");

            migrationBuilder.DropColumn(
                name: "IdMinimumRank",
                table: "GamePost");

            migrationBuilder.DropColumn(
                name: "LayoutJson",
                table: "Guilds");

            migrationBuilder.AddColumn<string>(
                name: "LinkDiscord",
                table: "Guilds",
                type: "varchar(255)",
                unicode: false,
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LinkForum",
                table: "Guilds",
                type: "varchar(255)",
                unicode: false,
                maxLength: 255,
                nullable: true);

            // Best effort: the old schema had one slot per kind, so the newest matching card wins and
            // any extra link a guild pinned since is lost. Recognised by the icon and label the Up wrote.
            migrationBuilder.Sql("""
                UPDATE g
                SET g.[LinkDiscord] = LEFT(CAST(l.[Url] AS nvarchar(255)), 255)
                FROM [Guilds] g
                INNER JOIN [GuildLinks] l ON l.[IdGuild] = g.[Id]
                WHERE l.[Icon] = 'discord'
                  AND l.[Id] = (SELECT MAX([Id]) FROM [GuildLinks] WHERE [IdGuild] = g.[Id] AND [Icon] = 'discord');

                UPDATE g
                SET g.[LinkForum] = LEFT(CAST(l.[Url] AS nvarchar(255)), 255)
                FROM [Guilds] g
                INNER JOIN [GuildLinks] l ON l.[IdGuild] = g.[Id]
                WHERE l.[Label] = 'Forum'
                  AND l.[Id] = (SELECT MAX([Id]) FROM [GuildLinks] WHERE [IdGuild] = g.[Id] AND [Label] = 'Forum');
                """);

            migrationBuilder.DropColumn(
                name: "Label",
                table: "GuildLinks");

            migrationBuilder.DropColumn(
                name: "Position",
                table: "GuildLinks");

            migrationBuilder.RenameColumn(
                name: "Url",
                table: "GuildLinks",
                newName: "Link");

            migrationBuilder.AlterColumn<string>(
                name: "Icon",
                table: "GuildLinks",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(30)",
                oldMaxLength: 30,
                oldNullable: true);
        }
    }
}
