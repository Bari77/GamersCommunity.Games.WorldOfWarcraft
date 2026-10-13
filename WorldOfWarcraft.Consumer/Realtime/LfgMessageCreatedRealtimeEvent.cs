namespace WorldOfWarcraft.Consumer.Realtime;

public sealed class LfgMessageCreatedRealtimeEvent
{
    public string Type { get; init; } = RealtimeEventTypes.LfgMessageCreated;

    public required LfgMessageRealtimePayload Message { get; init; }
}
