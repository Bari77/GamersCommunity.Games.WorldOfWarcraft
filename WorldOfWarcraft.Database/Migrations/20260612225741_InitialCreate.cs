using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorldOfWarcraft.Database.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Alignments",
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
                    table.PrimaryKey("PK_Alignement", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Classes",
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
                    table.PrimaryKey("PK_Class", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Directions",
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
                    table.PrimaryKey("PK_Direction", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Jobs",
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
                    table.PrimaryKey("PK_Jobs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Players",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    PresentationIrl = table.Column<string>(type: "text", nullable: true),
                    PresentationIg = table.Column<string>(type: "text", nullable: true),
                    SuccessPoints = table.Column<int>(type: "int", nullable: true, defaultValue: 0),
                    NbMount = table.Column<int>(type: "int", nullable: false),
                    IdUser = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    IdRank = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Players", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Races",
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
                    table.PrimaryKey("PK_Races", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Servers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    Entitled = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    IdLocale = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Servers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Specializations",
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
                    table.PrimaryKey("PK_Specializations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PlayerAnnouncements",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    Message = table.Column<string>(type: "text", nullable: false),
                    IdPlayer = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerAnnouncements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlayerAnnoucements_Player",
                        column: x => x.IdPlayer,
                        principalTable: "Players",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PlayerLinks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    Url = table.Column<string>(type: "text", nullable: false),
                    Icon = table.Column<int>(type: "int", nullable: false),
                    IdPlayer = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerLinks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlayerLinks_Player",
                        column: x => x.IdPlayer,
                        principalTable: "Players",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PlayerPictures",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    Url = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Share = table.Column<bool>(type: "bit", nullable: false),
                    IdPlayer = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerPictures", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlayerPictures_Player",
                        column: x => x.IdPlayer,
                        principalTable: "Players",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PlayerRank",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    IdPlayer = table.Column<int>(type: "int", nullable: false),
                    IdRank = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerRank", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlayerRank_Player",
                        column: x => x.IdPlayer,
                        principalTable: "Players",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PlayerStream",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    Url = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Share = table.Column<bool>(type: "bit", nullable: false),
                    IdPlayer = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerStream", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlayerStream_Player",
                        column: x => x.IdPlayer,
                        principalTable: "Players",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PlayerVideos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    Url = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Share = table.Column<bool>(type: "bit", nullable: false),
                    IdPlayer = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerVideos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlayerVideos_Player",
                        column: x => x.IdPlayer,
                        principalTable: "Players",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PlayerVip",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    BeginDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    EndDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    Messages = table.Column<string>(type: "text", nullable: false),
                    Activation = table.Column<bool>(type: "bit", nullable: false),
                    IdPlayer = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerVip", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlayerVip_Player",
                        column: x => x.IdPlayer,
                        principalTable: "Players",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "RaceClasses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    IdClass = table.Column<int>(type: "int", nullable: false),
                    IdRace = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RaceClasses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RaceClasses_Class",
                        column: x => x.IdClass,
                        principalTable: "Classes",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_RaceClasses_Race",
                        column: x => x.IdRace,
                        principalTable: "Races",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "SpecializationClasses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    Entitled = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    IdSpecialization = table.Column<int>(type: "int", nullable: false),
                    IdClass = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpecializationClasses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SpecializationClasses_Class",
                        column: x => x.IdClass,
                        principalTable: "Classes",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SpecializationClasses_Specialization",
                        column: x => x.IdSpecialization,
                        principalTable: "Specializations",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "CharacterJob",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    Level = table.Column<int>(type: "int", nullable: false),
                    IdCharacter = table.Column<int>(type: "int", nullable: false),
                    IdJob = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CharacterJob", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CharacterJob_Job",
                        column: x => x.IdJob,
                        principalTable: "Jobs",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Characters",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    Pseudo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Level = table.Column<int>(type: "int", nullable: false),
                    Ilvl = table.Column<int>(type: "int", nullable: false),
                    Achievement = table.Column<int>(type: "int", nullable: false),
                    Sentence = table.Column<string>(type: "text", nullable: true),
                    Main = table.Column<bool>(type: "bit", nullable: false),
                    IdRace = table.Column<int>(type: "int", nullable: false),
                    IdPlayer = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    IdDirection = table.Column<int>(type: "int", nullable: false),
                    IdServer = table.Column<int>(type: "int", nullable: false),
                    IdGuild = table.Column<int>(type: "int", nullable: true),
                    IdAlignment = table.Column<int>(type: "int", nullable: true),
                    IdMainSpecializationClass = table.Column<int>(type: "int", nullable: true),
                    IdSecondarySpecializationClass = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Character", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Character_Alignment",
                        column: x => x.IdAlignment,
                        principalTable: "Alignments",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Character_Direction",
                        column: x => x.IdDirection,
                        principalTable: "Directions",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Character_Player",
                        column: x => x.IdPlayer,
                        principalTable: "Players",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Character_Race",
                        column: x => x.IdRace,
                        principalTable: "Races",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Character_Server",
                        column: x => x.IdServer,
                        principalTable: "Servers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Character_SpecializationClass1",
                        column: x => x.IdMainSpecializationClass,
                        principalTable: "SpecializationClasses",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Character_SpecializationClass2",
                        column: x => x.IdSecondarySpecializationClass,
                        principalTable: "SpecializationClasses",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Events",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    Entitled = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    MinimumLevel = table.Column<int>(type: "int", nullable: true),
                    DateHourBegin = table.Column<DateTime>(type: "datetime", nullable: false),
                    DateHourEnd = table.Column<DateTime>(type: "datetime", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Location = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Picture = table.Column<string>(type: "text", nullable: false, defaultValue: "http://icon-icons.com/icons2/632/PNG/512/event-planner_icon-icons.com_58034.png"),
                    Places = table.Column<int>(type: "int", nullable: false),
                    EventGuild = table.Column<bool>(type: "bit", nullable: false),
                    IdAlignments = table.Column<int>(type: "int", nullable: true),
                    IdOrganizer = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Event", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Event_Alignment",
                        column: x => x.IdAlignments,
                        principalTable: "Alignments",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Event_Character",
                        column: x => x.IdOrganizer,
                        principalTable: "Characters",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Guilds",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    Entitled = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Level = table.Column<int>(type: "int", nullable: false),
                    Sentence = table.Column<string>(type: "text", nullable: true),
                    LinkDiscord = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    LinkForum = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    IdLeader = table.Column<int>(type: "int", nullable: false),
                    IdMainDirection = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Guilds", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Guilds_Characters",
                        column: x => x.IdLeader,
                        principalTable: "Characters",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Guilds_Directions",
                        column: x => x.IdMainDirection,
                        principalTable: "Directions",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "EventParticipants",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    IdStatus = table.Column<int>(type: "int", nullable: true),
                    IdCharacters = table.Column<int>(type: "int", nullable: false),
                    IdEvent = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tb_wow_ge_event_participant", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tb_wow_ge_event_participant_tb_wow_ge_event",
                        column: x => x.IdEvent,
                        principalTable: "Events",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_tb_wow_ge_event_participant_tb_wow_ge_personnage",
                        column: x => x.IdCharacters,
                        principalTable: "Characters",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "GuildAnnouncements",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    Message = table.Column<string>(type: "text", nullable: false),
                    IdGuild = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildAnnouncement", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildAnnouncement_Guild",
                        column: x => x.IdGuild,
                        principalTable: "Guilds",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "GuildLinks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    Link = table.Column<string>(type: "text", nullable: false),
                    Icon = table.Column<string>(type: "text", nullable: true),
                    IdGuild = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildLinks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildLinks_Guild",
                        column: x => x.IdGuild,
                        principalTable: "Guilds",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "GuildMessages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    Message = table.Column<string>(type: "text", nullable: false),
                    IdGuild = table.Column<int>(type: "int", nullable: false),
                    IdCharacter = table.Column<int>(type: "int", nullable: false)
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
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Request = table.Column<string>(type: "text", nullable: false),
                    IdGuild = table.Column<int>(type: "int", nullable: false)
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

            migrationBuilder.CreateTable(
                name: "GuildVip",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    BeginDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    Messages = table.Column<string>(type: "text", nullable: false),
                    Activation = table.Column<bool>(type: "bit", nullable: false),
                    IdGuild = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildVip", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildVip_Guilds",
                        column: x => x.IdGuild,
                        principalTable: "Guilds",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Rosters",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    Number = table.Column<int>(type: "int", nullable: false),
                    IdDirection = table.Column<int>(type: "int", nullable: false),
                    IdGuild = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rosters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Rosters_Direction",
                        column: x => x.IdDirection,
                        principalTable: "Directions",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Rosters_Guild",
                        column: x => x.IdGuild,
                        principalTable: "Guilds",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "RosterMembers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    IdRoster = table.Column<int>(type: "int", nullable: false),
                    IdCharacter = table.Column<int>(type: "int", nullable: false),
                    IdSpecialization = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RosterMembers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RosterMembers_Character",
                        column: x => x.IdCharacter,
                        principalTable: "Characters",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_RosterMembers_Roster",
                        column: x => x.IdRoster,
                        principalTable: "Rosters",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_RosterMembers_Specialization",
                        column: x => x.IdSpecialization,
                        principalTable: "Specializations",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_CharacterJob_IdCharacter",
                table: "CharacterJob",
                column: "IdCharacter");

            migrationBuilder.CreateIndex(
                name: "IX_CharacterJob_IdJob",
                table: "CharacterJob",
                column: "IdJob");

            migrationBuilder.CreateIndex(
                name: "IX_Characters_IdAlignment",
                table: "Characters",
                column: "IdAlignment");

            migrationBuilder.CreateIndex(
                name: "IX_Characters_IdDirection",
                table: "Characters",
                column: "IdDirection");

            migrationBuilder.CreateIndex(
                name: "IX_Characters_IdGuild",
                table: "Characters",
                column: "IdGuild");

            migrationBuilder.CreateIndex(
                name: "IX_Characters_IdMainSpecializationClass",
                table: "Characters",
                column: "IdMainSpecializationClass");

            migrationBuilder.CreateIndex(
                name: "IX_Characters_IdPlayer",
                table: "Characters",
                column: "IdPlayer");

            migrationBuilder.CreateIndex(
                name: "IX_Characters_IdRace",
                table: "Characters",
                column: "IdRace");

            migrationBuilder.CreateIndex(
                name: "IX_Characters_IdSecondarySpecializationClass",
                table: "Characters",
                column: "IdSecondarySpecializationClass");

            migrationBuilder.CreateIndex(
                name: "IX_Characters_IdServer",
                table: "Characters",
                column: "IdServer");

            migrationBuilder.CreateIndex(
                name: "IX_EventParticipants_IdCharacters",
                table: "EventParticipants",
                column: "IdCharacters");

            migrationBuilder.CreateIndex(
                name: "IX_EventParticipants_IdEvent",
                table: "EventParticipants",
                column: "IdEvent");

            migrationBuilder.CreateIndex(
                name: "IX_Events_IdAlignments",
                table: "Events",
                column: "IdAlignments");

            migrationBuilder.CreateIndex(
                name: "IX_Events_IdOrganizer",
                table: "Events",
                column: "IdOrganizer");

            migrationBuilder.CreateIndex(
                name: "IX_GuildAnnouncements_IdGuild",
                table: "GuildAnnouncements",
                column: "IdGuild");

            migrationBuilder.CreateIndex(
                name: "IX_GuildLinks_IdGuild",
                table: "GuildLinks",
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
                name: "IX_GuildRequest_IdGuild",
                table: "GuildRequest",
                column: "IdGuild");

            migrationBuilder.CreateIndex(
                name: "IX_Guilds_IdLeader",
                table: "Guilds",
                column: "IdLeader");

            migrationBuilder.CreateIndex(
                name: "IX_Guilds_IdMainDirection",
                table: "Guilds",
                column: "IdMainDirection");

            migrationBuilder.CreateIndex(
                name: "IX_GuildVip_IdGuild",
                table: "GuildVip",
                column: "IdGuild");

            migrationBuilder.CreateIndex(
                name: "IX_PlayerAnnouncements_IdPlayer",
                table: "PlayerAnnouncements",
                column: "IdPlayer");

            migrationBuilder.CreateIndex(
                name: "IX_PlayerLinks_IdPlayer",
                table: "PlayerLinks",
                column: "IdPlayer");

            migrationBuilder.CreateIndex(
                name: "IX_PlayerPictures_IdPlayer",
                table: "PlayerPictures",
                column: "IdPlayer");

            migrationBuilder.CreateIndex(
                name: "IX_PlayerRank_IdPlayer",
                table: "PlayerRank",
                column: "IdPlayer");

            migrationBuilder.CreateIndex(
                name: "IX_PlayerStream_IdPlayer",
                table: "PlayerStream",
                column: "IdPlayer");

            migrationBuilder.CreateIndex(
                name: "IX_PlayerVideos_IdPlayer",
                table: "PlayerVideos",
                column: "IdPlayer");

            migrationBuilder.CreateIndex(
                name: "IX_PlayerVip_IdPlayer",
                table: "PlayerVip",
                column: "IdPlayer");

            migrationBuilder.CreateIndex(
                name: "IX_RaceClasses_IdClass",
                table: "RaceClasses",
                column: "IdClass");

            migrationBuilder.CreateIndex(
                name: "IX_RaceClasses_IdRace",
                table: "RaceClasses",
                column: "IdRace");

            migrationBuilder.CreateIndex(
                name: "IX_RosterMembers_IdCharacter",
                table: "RosterMembers",
                column: "IdCharacter");

            migrationBuilder.CreateIndex(
                name: "IX_RosterMembers_IdRoster",
                table: "RosterMembers",
                column: "IdRoster");

            migrationBuilder.CreateIndex(
                name: "IX_RosterMembers_IdSpecialization",
                table: "RosterMembers",
                column: "IdSpecialization");

            migrationBuilder.CreateIndex(
                name: "IX_Rosters_IdDirection",
                table: "Rosters",
                column: "IdDirection");

            migrationBuilder.CreateIndex(
                name: "IX_Rosters_IdGuild",
                table: "Rosters",
                column: "IdGuild");

            migrationBuilder.CreateIndex(
                name: "IX_SpecializationClasses_IdClass",
                table: "SpecializationClasses",
                column: "IdClass");

            migrationBuilder.CreateIndex(
                name: "IX_SpecializationClasses_IdSpecialization",
                table: "SpecializationClasses",
                column: "IdSpecialization");

            migrationBuilder.AddForeignKey(
                name: "FK_CharacterJob_Character",
                table: "CharacterJob",
                column: "IdCharacter",
                principalTable: "Characters",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Character_Guild",
                table: "Characters",
                column: "IdGuild",
                principalTable: "Guilds",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Guilds_Characters",
                table: "Guilds");

            migrationBuilder.DropTable(
                name: "CharacterJob");

            migrationBuilder.DropTable(
                name: "EventParticipants");

            migrationBuilder.DropTable(
                name: "GuildAnnouncements");

            migrationBuilder.DropTable(
                name: "GuildLinks");

            migrationBuilder.DropTable(
                name: "GuildMessages");

            migrationBuilder.DropTable(
                name: "GuildRequest");

            migrationBuilder.DropTable(
                name: "GuildVip");

            migrationBuilder.DropTable(
                name: "PlayerAnnouncements");

            migrationBuilder.DropTable(
                name: "PlayerLinks");

            migrationBuilder.DropTable(
                name: "PlayerPictures");

            migrationBuilder.DropTable(
                name: "PlayerRank");

            migrationBuilder.DropTable(
                name: "PlayerStream");

            migrationBuilder.DropTable(
                name: "PlayerVideos");

            migrationBuilder.DropTable(
                name: "PlayerVip");

            migrationBuilder.DropTable(
                name: "RaceClasses");

            migrationBuilder.DropTable(
                name: "RosterMembers");

            migrationBuilder.DropTable(
                name: "Jobs");

            migrationBuilder.DropTable(
                name: "Events");

            migrationBuilder.DropTable(
                name: "Rosters");

            migrationBuilder.DropTable(
                name: "Characters");

            migrationBuilder.DropTable(
                name: "Alignments");

            migrationBuilder.DropTable(
                name: "Guilds");

            migrationBuilder.DropTable(
                name: "Players");

            migrationBuilder.DropTable(
                name: "Races");

            migrationBuilder.DropTable(
                name: "Servers");

            migrationBuilder.DropTable(
                name: "SpecializationClasses");

            migrationBuilder.DropTable(
                name: "Directions");

            migrationBuilder.DropTable(
                name: "Classes");

            migrationBuilder.DropTable(
                name: "Specializations");
        }
    }
}
