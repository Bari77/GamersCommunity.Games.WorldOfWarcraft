using GamersCommunity.Core.Hosting;
using GamersCommunity.Core.Logging;
using GamersCommunity.Core.Platform;
using GamersCommunity.Core.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Serilog;
using WorldOfWarcraft.Consumer.Configuration;
using WorldOfWarcraft.Consumer.Integration;
using WorldOfWarcraft.Consumer.Services.Infra;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Seed;

namespace WorldOfWarcraft.Consumer;

public class Program
{
    public static Task Main(string[] args) =>
        GamersCommunityConsumerHost.RunAsync<WorldOfWarcraftDbContext, WorldOfWarcraftServiceConsumer>(
            args,
            consoleTitle: "WorldOfWarcraft MicroService",
            configureLogging: (context, logging) =>
            {
                var loggerSettings = context.Configuration.GetSection("LoggerSettings").Get<LoggerSettings>() ?? new LoggerSettings();
                Logger.Initialize(loggerSettings, "WorldOfWarcraft MS", context.HostingEnvironment);
                logging.ClearProviders();
                Log.Information("Starting ...");
            },
            configureServices: (context, services) =>
            {
                services.AddOptions<AppSettings>().Bind(context.Configuration.GetSection("AppSettings")).ValidateOnStart();
                services.AddRealtimeEventPublisher();
                services.AddPlatformRpcClients();
                services.AddScoped<IGuildWhispers, GuildWhispers>();
                services.Scan(scan => scan
                    .FromAssembliesOf(typeof(AppSettings))
                    .AddClasses(c => c.AssignableTo<IBusService>())
                    .AsImplementedInterfaces()
                    .WithScopedLifetime());
                services.AddScoped<HealthService>();
                services.AddHostedService<PlatformEventsSubscriber>();
            },
            afterMigrate: async (db, sp, _) =>
            {
                var seedLogger = sp.GetRequiredService<ILoggerFactory>().CreateLogger("ReferenceDataSeed");
                await ReferenceDataSeed.EnsureAsync(db, seedLogger);
            });
}
