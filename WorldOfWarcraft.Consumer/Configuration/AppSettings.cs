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
    }
}
