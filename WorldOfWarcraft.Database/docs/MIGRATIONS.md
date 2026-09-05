# WorldOfWarcraft — EF Core Code First

The SQL Server schema is managed by **EF Core migrations** from models in `Models/` and configuration in `WorldOfWarcraftDbContext`.

Reference catalog data lives under `Seed/`: one **class per table** inheriting `KeyTableSeed`. Classes are **auto-discovered** (no manual list). Override `Order` only if FK dependencies require a sequence. Applied at **runtime** after `MigrateAsync`.

Displayable codes (`Entitled`, …) use **lowercase** snake_case so the front can concatenate them with i18n key prefixes (e.g. `wow.class.` + `demon_hunter`).

## Workflow

### New migration (after a **schema** change only)

```powershell
cd WorldOfWarcraft.Database
./Add-Migration.ps1 -Name MigrationName
```

Do **not** put seed rows in migrations (`HasData` / `InsertData`).

### Apply migrations + seed

Automatic on consumer startup (`WorldOfWarcraft.Consumer`): `MigrateAsync` then `ReferenceDataSeed.EnsureAsync`.

Manual migrate only:

```powershell
dotnet ef database update `
  --project WorldOfWarcraft.Database/WorldOfWarcraft.Database.csproj `
  --startup-project WorldOfWarcraft.Consumer/WorldOfWarcraft.Consumer.csproj
```

## Change the model

1. Edit or add an entity under `Models/`
2. Adjust `WorldOfWarcraftDbContext.OnModelCreating` if needed
3. Create a migration with `Add-Migration.ps1` for schema diffs
4. Add a `Seed/<Table>Seed.cs` class (auto-discovered; set `Order` if FK-dependent) — no migration

> **Do not use** `GenerateEFEntities.ps1` anymore — replaced by this Code First flow.

## Public identifiers (API / URLs)

Do **not** expose sequential `int` primary keys in public URLs for user-owned resources (`Character`, `Event`, guilds, …).

**Retained model:** keep `int Id` as the internal PK (joins, `IKeyTable`, reference FKs). **`PublicId` (`uniqueidentifier` / `Guid`, unique, `NEWSEQUENTIALID()`)** is on user-owned entities. Index unique via `PublicIdConvention`. Routes and DTOs should use `PublicId`; authorization still required.

Reference catalog tables (classes, races, servers, …) stay on stable `int` ids used by seeds.

Entities with `PublicId`: `Player`, `Character`, `Guild`, `Event`, `EventParticipant`, guild/player content tables, `Roster`, `RosterMember`, `CharacterJob`, `PlayerRank`. Migration: `AddPublicId`.
