namespace WorldOfWarcraft.Consumer.Configuration
{
    /// <summary>
    /// App settings representation class
    /// </summary>
    public class AppSettings
    {
        /// <summary>
        /// Highest character level allowed. Blizzard raises it with every expansion,
        /// so it is configuration rather than a constant.
        /// </summary>
        public int MaxCharacterLevel { get; set; } = 120;

        /// <summary>
        /// Highest item level allowed, raised alongside each expansion.
        /// </summary>
        public int MaxItemLevel { get; set; } = 1000;

        /// <summary>
        /// Public origin of the WoW front, so Platform Whispers can load crest artwork from
        /// <c>/wow-crests</c>. It must be a URL the browser can reach, not an internal hostname.
        /// </summary>
        public string PublicAssetsUrl { get; set; } = "http://localhost:4201";
    }
}
