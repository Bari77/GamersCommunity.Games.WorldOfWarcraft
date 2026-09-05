# GamersCommunity.Games.WorldOfWarcraft

WoW microservice + micro-frontend. **Only entry required for the team**: this repo (+ GitHub Packages auth).  
No daily Core / Gateway / Shell checkout.

## GitHub Packages auth (once)

PAT with `read:packages`:

```powershell
# NuGet
dotnet nuget update source github -u YOUR_USER -p ghp_xxx --store-password-in-clear-text

# npm
$env:NODE_AUTH_TOKEN = "ghp_xxx"

# GHCR (game-full)
echo ghp_xxx | docker login ghcr.io -u YOUR_USER --password-stdin
```

## Front (UI-only / mocks)

```bash
cd WorldOfWarcraft.Front
npm install
npm start
```

## Game-full

```powershell
$env:GITHUB_TOKEN = "ghp_xxx"
.\scripts\up.ps1
cd WorldOfWarcraft.Front
npm run start:api
```

DevGateway: http://localhost:8081 — image `ghcr.io/bari77/gc-devgateway`.

SQL (host client): `127.0.0.1,14333` / `sa` / `Your_password123`  
(Trust server certificate = yes). Use **127.0.0.1** (not `localhost`): Podman does not listen on IPv6, and SSMS often resolves `localhost` → `::1`.

## Shell integration

Contract: `contracts/federation.contract.json` + `contracts/openapi.yaml`.  
The Shell team wires the remote; WoW does not need to clone the Front.
