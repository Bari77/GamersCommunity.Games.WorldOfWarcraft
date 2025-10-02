using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Database.Context;

public partial class WorldOfWarcraftDbContext : DbContext
{
    public WorldOfWarcraftDbContext(DbContextOptions<WorldOfWarcraftDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Alignment> Alignments { get; set; }

    public virtual DbSet<Character> Characters { get; set; }

    public virtual DbSet<CharacterJob> CharacterJobs { get; set; }

    public virtual DbSet<Class> Classes { get; set; }

    public virtual DbSet<Direction> Directions { get; set; }

    public virtual DbSet<Event> Events { get; set; }

    public virtual DbSet<EventParticipant> EventParticipants { get; set; }

    public virtual DbSet<Guild> Guilds { get; set; }

    public virtual DbSet<GuildAnnouncement> GuildAnnouncements { get; set; }

    public virtual DbSet<GuildLink> GuildLinks { get; set; }

    public virtual DbSet<GuildMessage> GuildMessages { get; set; }

    public virtual DbSet<GuildRequest> GuildRequests { get; set; }

    public virtual DbSet<GuildVip> GuildVips { get; set; }

    public virtual DbSet<Job> Jobs { get; set; }

    public virtual DbSet<Player> Players { get; set; }

    public virtual DbSet<PlayerAnnouncement> PlayerAnnouncements { get; set; }

    public virtual DbSet<PlayerLink> PlayerLinks { get; set; }

    public virtual DbSet<PlayerPicture> PlayerPictures { get; set; }

    public virtual DbSet<PlayerRank> PlayerRanks { get; set; }

    public virtual DbSet<PlayerStream> PlayerStreams { get; set; }

    public virtual DbSet<PlayerVideo> PlayerVideos { get; set; }

    public virtual DbSet<PlayerVip> PlayerVips { get; set; }

    public virtual DbSet<Race> Races { get; set; }

    public virtual DbSet<RaceClass> RaceClasses { get; set; }

    public virtual DbSet<Roster> Rosters { get; set; }

    public virtual DbSet<RosterMember> RosterMembers { get; set; }

    public virtual DbSet<Server> Servers { get; set; }

    public virtual DbSet<Specialization> Specializations { get; set; }

    public virtual DbSet<SpecializationClass> SpecializationClasses { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Alignment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Alignement");

            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Entitled).HasMaxLength(50);
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Character>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Character");

            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IdPlayer).HasDefaultValue(1);
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Pseudo).HasMaxLength(50);
            entity.Property(e => e.Sentence).HasColumnType("text");

            entity.HasOne(d => d.IdAlignmentNavigation).WithMany(p => p.Characters)
                .HasForeignKey(d => d.IdAlignment)
                .HasConstraintName("FK_Character_Alignment");

            entity.HasOne(d => d.IdDirectionNavigation).WithMany(p => p.Characters)
                .HasForeignKey(d => d.IdDirection)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Character_Direction");

            entity.HasOne(d => d.IdGuildNavigation).WithMany(p => p.Characters)
                .HasForeignKey(d => d.IdGuild)
                .HasConstraintName("FK_Character_Guild");

            entity.HasOne(d => d.IdMainSpecializationClassNavigation).WithMany(p => p.CharacterIdMainSpecializationClassNavigations)
                .HasForeignKey(d => d.IdMainSpecializationClass)
                .HasConstraintName("FK_Character_SpecializationClass1");

            entity.HasOne(d => d.IdPlayerNavigation).WithMany(p => p.Characters)
                .HasForeignKey(d => d.IdPlayer)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Character_Player");

            entity.HasOne(d => d.IdRaceNavigation).WithMany(p => p.Characters)
                .HasForeignKey(d => d.IdRace)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Character_Race");

            entity.HasOne(d => d.IdSecondarySpecializationClassNavigation).WithMany(p => p.CharacterIdSecondarySpecializationClassNavigations)
                .HasForeignKey(d => d.IdSecondarySpecializationClass)
                .HasConstraintName("FK_Character_SpecializationClass2");

            entity.HasOne(d => d.IdServerNavigation).WithMany(p => p.Characters)
                .HasForeignKey(d => d.IdServer)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Character_Server");
        });

        modelBuilder.Entity<CharacterJob>(entity =>
        {
            entity.ToTable("CharacterJob");

            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.IdCharacterNavigation).WithMany(p => p.CharacterJobs)
                .HasForeignKey(d => d.IdCharacter)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CharacterJob_Character");

            entity.HasOne(d => d.IdJobNavigation).WithMany(p => p.CharacterJobs)
                .HasForeignKey(d => d.IdJob)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CharacterJob_Job");
        });

        modelBuilder.Entity<Class>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Class");

            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Entitled).HasMaxLength(50);
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Direction>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Direction");

            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Entitled).HasMaxLength(50);
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Event");

            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateHourBegin).HasColumnType("datetime");
            entity.Property(e => e.DateHourEnd).HasColumnType("datetime");
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.Entitled).HasMaxLength(50);
            entity.Property(e => e.Location).HasMaxLength(50);
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Picture)
                .HasDefaultValue("http://icon-icons.com/icons2/632/PNG/512/event-planner_icon-icons.com_58034.png")
                .HasColumnType("text");

            entity.HasOne(d => d.IdAlignmentsNavigation).WithMany(p => p.Events)
                .HasForeignKey(d => d.IdAlignments)
                .HasConstraintName("FK_Event_Alignment");

            entity.HasOne(d => d.IdOrganizerNavigation).WithMany(p => p.Events)
                .HasForeignKey(d => d.IdOrganizer)
                .HasConstraintName("FK_Event_Character");
        });

        modelBuilder.Entity<EventParticipant>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_tb_wow_ge_event_participant");

            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.IdCharactersNavigation).WithMany(p => p.EventParticipants)
                .HasForeignKey(d => d.IdCharacters)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tb_wow_ge_event_participant_tb_wow_ge_personnage");

            entity.HasOne(d => d.IdEventNavigation).WithMany(p => p.EventParticipants)
                .HasForeignKey(d => d.IdEvent)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tb_wow_ge_event_participant_tb_wow_ge_event");
        });

        modelBuilder.Entity<Guild>(entity =>
        {
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Entitled).HasMaxLength(50);
            entity.Property(e => e.LinkDiscord)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.LinkForum)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Sentence).HasColumnType("text");

            entity.HasOne(d => d.IdLeaderNavigation).WithMany(p => p.Guilds)
                .HasForeignKey(d => d.IdLeader)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Guilds_Characters");

            entity.HasOne(d => d.IdMainDirectionNavigation).WithMany(p => p.Guilds)
                .HasForeignKey(d => d.IdMainDirection)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Guilds_Directions");
        });

        modelBuilder.Entity<GuildAnnouncement>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_GuildAnnouncement");

            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Message).HasColumnType("text");
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.IdGuildNavigation).WithMany(p => p.GuildAnnouncements)
                .HasForeignKey(d => d.IdGuild)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_GuildAnnouncement_Guild");
        });

        modelBuilder.Entity<GuildLink>(entity =>
        {
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Icon).HasColumnType("text");
            entity.Property(e => e.Link).HasColumnType("text");
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.IdGuildNavigation).WithMany(p => p.GuildLinks)
                .HasForeignKey(d => d.IdGuild)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_GuildLinks_Guild");
        });

        modelBuilder.Entity<GuildMessage>(entity =>
        {
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Message).HasColumnType("text");
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.IdCharacterNavigation).WithMany(p => p.GuildMessages)
                .HasForeignKey(d => d.IdCharacter)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_GuildMessages_Characters");

            entity.HasOne(d => d.IdGuildNavigation).WithMany(p => p.GuildMessages)
                .HasForeignKey(d => d.IdGuild)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_GuildMessages_Guilds");
        });

        modelBuilder.Entity<GuildRequest>(entity =>
        {
            entity.ToTable("GuildRequest");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Request).HasColumnType("text");
            entity.Property(e => e.Title).HasMaxLength(255);

            entity.HasOne(d => d.IdGuildNavigation).WithMany(p => p.GuildRequests)
                .HasForeignKey(d => d.IdGuild)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_GuildRequest_Guilds");
        });

        modelBuilder.Entity<GuildVip>(entity =>
        {
            entity.ToTable("GuildVip");

            entity.Property(e => e.BeginDate).HasColumnType("datetime");
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.EndDate).HasColumnType("datetime");
            entity.Property(e => e.Messages).HasColumnType("text");
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.IdGuildNavigation).WithMany(p => p.GuildVips)
                .HasForeignKey(d => d.IdGuild)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_GuildVip_Guilds");
        });

        modelBuilder.Entity<Job>(entity =>
        {
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Entitled).HasMaxLength(50);
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Player>(entity =>
        {
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IdUser).HasDefaultValue(1);
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PresentationIg).HasColumnType("text");
            entity.Property(e => e.PresentationIrl).HasColumnType("text");
            entity.Property(e => e.SuccessPoints).HasDefaultValue(0);
        });

        modelBuilder.Entity<PlayerAnnouncement>(entity =>
        {
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Message).HasColumnType("text");
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.IdPlayerNavigation).WithMany(p => p.PlayerAnnouncements)
                .HasForeignKey(d => d.IdPlayer)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PlayerAnnoucements_Player");
        });

        modelBuilder.Entity<PlayerLink>(entity =>
        {
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Url).HasColumnType("text");

            entity.HasOne(d => d.IdPlayerNavigation).WithMany(p => p.PlayerLinks)
                .HasForeignKey(d => d.IdPlayer)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PlayerLinks_Player");
        });

        modelBuilder.Entity<PlayerPicture>(entity =>
        {
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Title).HasMaxLength(50);
            entity.Property(e => e.Url).HasColumnType("text");

            entity.HasOne(d => d.IdPlayerNavigation).WithMany(p => p.PlayerPictures)
                .HasForeignKey(d => d.IdPlayer)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PlayerPictures_Player");
        });

        modelBuilder.Entity<PlayerRank>(entity =>
        {
            entity.ToTable("PlayerRank");

            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.IdPlayerNavigation).WithMany(p => p.PlayerRanks)
                .HasForeignKey(d => d.IdPlayer)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PlayerRank_Player");
        });

        modelBuilder.Entity<PlayerStream>(entity =>
        {
            entity.ToTable("PlayerStream");

            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Url).HasColumnType("text");

            entity.HasOne(d => d.IdPlayerNavigation).WithMany(p => p.PlayerStreams)
                .HasForeignKey(d => d.IdPlayer)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PlayerStream_Player");
        });

        modelBuilder.Entity<PlayerVideo>(entity =>
        {
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Title).HasMaxLength(50);
            entity.Property(e => e.Url).HasColumnType("text");

            entity.HasOne(d => d.IdPlayerNavigation).WithMany(p => p.PlayerVideos)
                .HasForeignKey(d => d.IdPlayer)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PlayerVideos_Player");
        });

        modelBuilder.Entity<PlayerVip>(entity =>
        {
            entity.ToTable("PlayerVip");

            entity.Property(e => e.BeginDate).HasColumnType("datetime");
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.EndDate).HasColumnType("datetime");
            entity.Property(e => e.Messages).HasColumnType("text");
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.IdPlayerNavigation).WithMany(p => p.PlayerVips)
                .HasForeignKey(d => d.IdPlayer)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PlayerVip_Player");
        });

        modelBuilder.Entity<Race>(entity =>
        {
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Entitled).HasMaxLength(50);
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<RaceClass>(entity =>
        {
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.IdClassNavigation).WithMany(p => p.RaceClasses)
                .HasForeignKey(d => d.IdClass)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RaceClasses_Class");

            entity.HasOne(d => d.IdRaceNavigation).WithMany(p => p.RaceClasses)
                .HasForeignKey(d => d.IdRace)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RaceClasses_Race");
        });

        modelBuilder.Entity<Roster>(entity =>
        {
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.IdDirectionNavigation).WithMany(p => p.Rosters)
                .HasForeignKey(d => d.IdDirection)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Rosters_Direction");

            entity.HasOne(d => d.IdGuildNavigation).WithMany(p => p.Rosters)
                .HasForeignKey(d => d.IdGuild)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Rosters_Guild");
        });

        modelBuilder.Entity<RosterMember>(entity =>
        {
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.IdCharacterNavigation).WithMany(p => p.RosterMembers)
                .HasForeignKey(d => d.IdCharacter)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RosterMembers_Character");

            entity.HasOne(d => d.IdRosterNavigation).WithMany(p => p.RosterMembers)
                .HasForeignKey(d => d.IdRoster)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RosterMembers_Roster");

            entity.HasOne(d => d.IdSpecializationNavigation).WithMany(p => p.RosterMembers)
                .HasForeignKey(d => d.IdSpecialization)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RosterMembers_Specialization");
        });

        modelBuilder.Entity<Server>(entity =>
        {
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Entitled).HasMaxLength(50);
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Specialization>(entity =>
        {
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Entitled).HasMaxLength(50);
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<SpecializationClass>(entity =>
        {
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Entitled).HasMaxLength(50);
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.IdClassNavigation).WithMany(p => p.SpecializationClasses)
                .HasForeignKey(d => d.IdClass)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SpecializationClasses_Class");

            entity.HasOne(d => d.IdSpecializationNavigation).WithMany(p => p.SpecializationClasses)
                .HasForeignKey(d => d.IdSpecialization)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SpecializationClasses_Specialization");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
