# Step 1: Minimal runtime to run the application in production
FROM mcr.microsoft.com/dotnet/runtime:9.0 AS base
WORKDIR /app

# Use a non-root user (if needed)
USER $APP_UID

# Step 2: SDK image to build and restore dependencies
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy the .csproj file and restore dependencies
COPY ["GamersCommunity.WorldOfWarcraft/WorldOfWarcraft.Consumer/WorldOfWarcraft.Consumer.csproj", "GamersCommunity.WorldOfWarcraft/WorldOfWarcraft.Consumer/"]
RUN dotnet restore "GamersCommunity.WorldOfWarcraft/WorldOfWarcraft.Consumer/WorldOfWarcraft.Consumer.csproj"

# Copy the remaining source files and build the project
COPY . .
WORKDIR "/src/GamersCommunity.WorldOfWarcraft/WorldOfWarcraft.Consumer"
RUN dotnet build "WorldOfWarcraft.Consumer.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Step 3: Publish the project for optimized runtime execution
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "WorldOfWarcraft.Consumer.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Step 4: Final image for production execution
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WorldOfWarcraft.Consumer.dll"]
