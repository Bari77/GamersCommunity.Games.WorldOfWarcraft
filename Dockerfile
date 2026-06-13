FROM mcr.microsoft.com/dotnet/runtime:10.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["WorldOfWarcraft.Consumer/WorldOfWarcraft.Consumer.csproj", "WorldOfWarcraft.Consumer/"]
COPY ["WorldOfWarcraft.Database/WorldOfWarcraft.Database.csproj", "WorldOfWarcraft.Database/"]
RUN dotnet restore "WorldOfWarcraft.Consumer/WorldOfWarcraft.Consumer.csproj"

COPY WorldOfWarcraft.Consumer/ WorldOfWarcraft.Consumer/
COPY WorldOfWarcraft.Database/ WorldOfWarcraft.Database/
WORKDIR "/src/WorldOfWarcraft.Consumer"
RUN dotnet build "WorldOfWarcraft.Consumer.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "WorldOfWarcraft.Consumer.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WorldOfWarcraft.Consumer.dll"]
