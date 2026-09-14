using System.Collections.Concurrent;
using System.Text;
using GamersCommunity.Core.Enums;
using GamersCommunity.Core.Exceptions;
using GamersCommunity.Core.Rabbit;
using GamersCommunity.Core.Serialization;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Serilog;

namespace WorldOfWarcraft.Consumer.Integration;

public interface IPlatformFriendsClient
{
    /// <summary>
    /// Tells whether the two Platform users are accepted friends.
    /// </summary>
    Task<bool> AreFriendsAsync(
        Guid firstPlatformUserPublicId,
        Guid secondPlatformUserPublicId,
        CancellationToken ct = default);
}

/// <summary>
/// Asks Platform whether two players are friends, to gate a friends-only page.
/// </summary>
/// <remarks>
/// <para>
/// Friendships belong to Platform and must never be replicated into this database, so there is no
/// local table to read: the check is a synchronous RPC on the Platform queue. A short-lived cache
/// keeps a burst of page loads from turning into a burst of round trips.
/// </para>
/// <para>
/// The check fails soft, unlike the sanctions one: an unreachable Platform means the friends-only
/// page stays hidden, which is the least privilege answer and never leaks a sheet.
/// </para>
/// </remarks>
public sealed class PlatformFriendsClient(IOptions<RabbitMQSettings> opts, ILogger logger)
    : IPlatformFriendsClient, IAsyncDisposable
{
    private const string PlatformQueue = "platform_queue";
    private static readonly TimeSpan CacheDuration = TimeSpan.FromSeconds(30);

    private readonly RabbitMQSettings _settings = opts.Value;

    private readonly ConnectionFactory _factory = new()
    {
        HostName = opts.Value.Hostname,
        UserName = opts.Value.Username,
        Password = opts.Value.Password,
    };

    private readonly ConcurrentDictionary<string, CacheEntry> _cache = new();
    private readonly SemaphoreSlim _gate = new(1, 1);
    private IConnection? _connection;

    public async Task<bool> AreFriendsAsync(
        Guid firstPlatformUserPublicId,
        Guid secondPlatformUserPublicId,
        CancellationToken ct = default)
    {
        if (firstPlatformUserPublicId == Guid.Empty || secondPlatformUserPublicId == Guid.Empty)
            return false;

        if (firstPlatformUserPublicId == secondPlatformUserPublicId)
            return false;

        // Friendship is symmetric, so both call orders share one cache entry.
        var (first, second) = firstPlatformUserPublicId.CompareTo(secondPlatformUserPublicId) <= 0
            ? (firstPlatformUserPublicId, secondPlatformUserPublicId)
            : (secondPlatformUserPublicId, firstPlatformUserPublicId);

        var key = $"{first:N}:{second:N}";
        if (_cache.TryGetValue(key, out var cached) && cached.ExpiresAt > DateTime.UtcNow)
            return cached.AreFriends;

        var areFriends = await FetchAreFriendsAsync(first, second, ct);
        _cache[key] = new CacheEntry(areFriends, DateTime.UtcNow.Add(CacheDuration));

        PruneCache();
        return areFriends;
    }

    public async ValueTask DisposeAsync()
    {
        await _gate.WaitAsync();
        try
        {
            if (_connection is not null)
            {
                await _connection.DisposeAsync();
                _connection = null;
            }
        }
        finally
        {
            _gate.Release();
            _gate.Dispose();
        }
    }

    private async Task<bool> FetchAreFriendsAsync(Guid first, Guid second, CancellationToken ct)
    {
        var payload = JsonSafe.Serialize(new BusMessage
        {
            Type = BusServiceTypeEnum.DATA,
            Resource = "Friends",
            Action = "ARE_FRIENDS",
            Data = JsonSafe.Serialize(new AreFriendsRequest
            {
                FirstUserPublicId = first,
                SecondUserPublicId = second,
            }),
        });

        string response;
        try
        {
            response = await CallAsync(payload, ct);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            // Least privilege: an unanswered question keeps the friends-only page hidden.
            logger.Error(ex, "Could not read the Platform friendship; treating the players as strangers.");
            return false;
        }

        return JsonSafe.Deserialize<AreFriendsResult>(response)?.AreFriends ?? false;
    }

    /// <summary>
    /// Minimal RPC over the default exchange: publish on the Platform queue with an exclusive reply
    /// queue, and wait for the envelope carrying the matching correlation id.
    /// </summary>
    private async Task<string> CallAsync(string payload, CancellationToken ct)
    {
        var connection = await EnsureConnectionAsync(ct);
        await using var channel = await connection.CreateChannelAsync(cancellationToken: CancellationToken.None);

        var replyQueue = await channel.QueueDeclareAsync(
            queue: string.Empty,
            durable: false,
            exclusive: true,
            autoDelete: true,
            arguments: null,
            cancellationToken: CancellationToken.None);

        var correlationId = Guid.NewGuid().ToString("N");
        var completion = new TaskCompletionSource<string>(TaskCreationOptions.RunContinuationsAsynchronously);

        var consumer = new AsyncEventingBasicConsumer(channel);
        consumer.ReceivedAsync += (_, ea) =>
        {
            if (ea.BasicProperties?.CorrelationId != correlationId)
                return Task.CompletedTask;

            try
            {
                var body = Encoding.UTF8.GetString(ea.Body.ToArray());
                var envelope = JsonSafe.Deserialize<RpcEnvelope<string?>>(body)
                    ?? throw new RpcException("INVALID_RESPONSE", "Response cannot be deserialized.", body);

                if (!envelope.Ok)
                {
                    throw new RpcException(
                        envelope.Error?.Code ?? "ERROR",
                        envelope.Error?.Message ?? "Unknown error");
                }

                completion.TrySetResult(envelope.Data ?? string.Empty);
            }
            catch (Exception ex)
            {
                completion.TrySetException(ex);
            }

            return Task.CompletedTask;
        };

        var consumerTag = await channel.BasicConsumeAsync(
            queue: replyQueue.QueueName,
            autoAck: true,
            consumer: consumer,
            cancellationToken: CancellationToken.None);

        try
        {
            await channel.BasicPublishAsync(
                exchange: string.Empty,
                routingKey: PlatformQueue,
                mandatory: false,
                basicProperties: new BasicProperties
                {
                    CorrelationId = correlationId,
                    ReplyTo = replyQueue.QueueName,
                    ContentType = "application/json",
                    ContentEncoding = "utf-8",
                },
                body: Encoding.UTF8.GetBytes(payload),
                cancellationToken: CancellationToken.None);

            using var timeout = new CancellationTokenSource(TimeSpan.FromSeconds(_settings.Timeout));
            using var linked = CancellationTokenSource.CreateLinkedTokenSource(ct, timeout.Token);

            try
            {
                return await completion.Task.WaitAsync(linked.Token);
            }
            catch (OperationCanceledException) when (timeout.IsCancellationRequested)
            {
                throw new GatewayTimeoutException(
                    "TIMEOUT",
                    $"Platform did not answer within {_settings.Timeout}s.");
            }
        }
        finally
        {
            try
            {
                await channel.BasicCancelAsync(consumerTag, cancellationToken: CancellationToken.None);
            }
            catch
            {
                /* channel may already be closing */
            }
        }
    }

    private async Task<IConnection> EnsureConnectionAsync(CancellationToken ct)
    {
        if (_connection is { IsOpen: true })
            return _connection;

        await _gate.WaitAsync(ct);
        try
        {
            if (_connection is { IsOpen: true })
                return _connection;

            _connection = await _factory.CreateConnectionAsync(ct);
            return _connection;
        }
        finally
        {
            _gate.Release();
        }
    }

    private void PruneCache()
    {
        var now = DateTime.UtcNow;
        foreach (var (key, entry) in _cache)
        {
            if (entry.ExpiresAt <= now)
                _cache.TryRemove(key, out _);
        }
    }

    private sealed record CacheEntry(bool AreFriends, DateTime ExpiresAt);

    /// <summary>
    /// Mirrors Platform's <c>AreFriendsRequestDto</c>. Kept local so the two services stay free to
    /// evolve their own payloads.
    /// </summary>
    private sealed class AreFriendsRequest
    {
        public Guid FirstUserPublicId { get; init; }

        public Guid SecondUserPublicId { get; init; }
    }

    private sealed class AreFriendsResult
    {
        public bool AreFriends { get; init; }
    }
}
