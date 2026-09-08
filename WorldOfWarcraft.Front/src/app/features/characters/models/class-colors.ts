const CLASS_COLORS: Record<string, string> = {
    warrior: "#c69b6d",
    paladin: "#f48cba",
    hunter: "#aad372",
    rogue: "#fff468",
    priest: "#ffffff",
    shaman: "#0070dd",
    mage: "#3fc7eb",
    warlock: "#8788ee",
    monk: "#00ff98",
    druid: "#ff7c0a",
    demon_hunter: "#a330c9",
    death_knight: "#c41e3a",
    evoker: "#33937f",
};

const NEUTRAL = "#8f9bb3";

export function classColor(className: string | null | undefined): string {
    return (className && CLASS_COLORS[className]) || NEUTRAL;
}
