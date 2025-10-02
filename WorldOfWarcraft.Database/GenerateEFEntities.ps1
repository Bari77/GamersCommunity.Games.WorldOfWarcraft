Write-Host "Generating EF Core models..." -ForegroundColor Cyan
dotnet ef dbcontext scaffold Name=ConnectionStrings:Database Microsoft.EntityFrameworkCore.SqlServer --output-dir Models --context-dir Context --context WorldOfWarcraftDbContext --force --use-database-names --startup-project ../WorldOfWarcraft.Consumer --no-onconfiguring

Write-Host "Add using and heritage..." -ForegroundColor Cyan
Get-ChildItem -Path ./Models -Filter *.cs | ForEach-Object {
    $lines = Get-Content $_.FullName

    $lines = $lines | Where-Object { $_ -notmatch '^using ' }
    $lines = @("using GamersCommunity.Core.Database;") + $lines

    $lines = $lines -replace 'public partial class (\w+)', 'public partial class $1 : IKeyTable'

    Set-Content $_.FullName $lines
}