# WorldOfWarcraft — EF Core Code First

The SQL Server schema is managed by **EF Core migrations** from models in `Models/` and configuration in `WorldOfWarcraftDbContext`.

## Workflow

### New migration (after a model change)

```powershell
cd WorldOfWarcraft.Database
./Add-Migration.ps1 -Name MigrationName
```

### Apply migrations

Automatic on consumer startup (`WorldOfWarcraft.Consumer`).

Manual:

```powershell
dotnet ef database update `
  --project WorldOfWarcraft.Database/WorldOfWarcraft.Database.csproj `
  --startup-project WorldOfWarcraft.Consumer/WorldOfWarcraft.Consumer.csproj
```

## Change the model

1. Edit or add an entity under `Models/`
2. Adjust `WorldOfWarcraftDbContext.OnModelCreating` if needed
3. Create a migration with `Add-Migration.ps1`

> **Do not use** `GenerateEFEntities.ps1` anymore — replaced by this Code First flow.
