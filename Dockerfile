# Build from this game repo only (Core from GitHub NuGet Packages).
# Local (classic docker-compose / podman compose):
#   set GITHUB_TOKEN then: podman compose up -d --build
# Prefer BuildKit when available: DOCKER_BUILDKIT=1

FROM mcr.microsoft.com/dotnet/runtime:10.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
ARG GITHUB_TOKEN=
WORKDIR /src

COPY nuget.config ./
COPY WorldOfWarcraft.Consumer/WorldOfWarcraft.Consumer.csproj WorldOfWarcraft.Consumer/
COPY WorldOfWarcraft.Database/WorldOfWarcraft.Database.csproj WorldOfWarcraft.Database/

RUN if [ -n "$GITHUB_TOKEN" ]; then \
      dotnet nuget update source github \
        --username "x-access-token" \
        --password "$GITHUB_TOKEN" \
        --store-password-in-clear-text; \
    fi \
    && dotnet restore "WorldOfWarcraft.Consumer/WorldOfWarcraft.Consumer.csproj"

COPY WorldOfWarcraft.Consumer/ WorldOfWarcraft.Consumer/
COPY WorldOfWarcraft.Database/ WorldOfWarcraft.Database/
WORKDIR /src/WorldOfWarcraft.Consumer
RUN dotnet publish "WorldOfWarcraft.Consumer.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "WorldOfWarcraft.Consumer.dll"]
