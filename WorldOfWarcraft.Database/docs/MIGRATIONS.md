# WorldOfWarcraft — EF Core Code First

Le schéma SQL Server est géré par **migrations EF Core** à partir des modèles dans `Models/` et de la configuration dans `WorldOfWarcraftDbContext`.

## Workflow

### Nouvelle migration (après modification d'un modèle)

```powershell
cd WorldOfWarcraft.Database
./Add-Migration.ps1 -Name NomDeLaMigration
```

### Appliquer les migrations

Automatique au démarrage du consumer (`WorldOfWarcraft.Consumer`).

Manuel :

```powershell
dotnet ef database update `
  --project WorldOfWarcraft.Database/WorldOfWarcraft.Database.csproj `
  --startup-project WorldOfWarcraft.Consumer/WorldOfWarcraft.Consumer.csproj
```

## Modifier le modèle

1. Éditer ou ajouter une entité dans `Models/`
2. Ajuster `WorldOfWarcraftDbContext.OnModelCreating` si besoin
3. Créer une migration avec `Add-Migration.ps1`

> **Ne plus utiliser** `GenerateEFEntities.ps1` — remplacé par ce flux Code First.
