param(
    [Parameter(Mandatory = $true)]
    [string]$Name
)

Write-Host "Adding EF Core migration '$Name'..." -ForegroundColor Cyan
dotnet ef migrations add $Name `
    --project ./WorldOfWarcraft.Database.csproj `
    --startup-project ../WorldOfWarcraft.Consumer/WorldOfWarcraft.Consumer.csproj `
    --output-dir Migrations

Write-Host "Done. Apply with: dotnet ef database update --project ./WorldOfWarcraft.Database.csproj --startup-project ../WorldOfWarcraft.Consumer/WorldOfWarcraft.Consumer.csproj" -ForegroundColor Green
