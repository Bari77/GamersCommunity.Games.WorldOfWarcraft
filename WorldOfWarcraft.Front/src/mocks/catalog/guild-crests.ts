import { CREST_BORDER_COUNT, CREST_EMBLEM_COUNT } from "@shared/models/guild-crest";
import { GuildCrestDto } from "@shared/models/guild-crest.dto";

/**
 * Seeded PRNG (FNV-1a seed + mulberry32): the same seed always yields the same sequence, so mock
 * guilds keep their tabard across reloads while still looking hand-picked.
 */
export function mockRandom(seed: string): () => number {
    let state = 2166136261;
    for (let i = 0; i < seed.length; i++) {
        state ^= seed.charCodeAt(i);
        state = Math.imul(state, 16777619);
    }
    return () => {
        state = (state + 0x6d2b79f5) | 0;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export const pickOne = <T>(random: () => number, items: readonly T[]): T => items[Math.floor(random() * items.length)];

/** Cloth / border / emblem triplets that read well on the in-game tabard, whatever the faction. */
const CREST_PALETTES: readonly (readonly [string, string, string])[] = [
    ["#6b1414", "#d4af37", "#f3e3b5"],
    ["#14254a", "#c0c8d4", "#e8eef7"],
    ["#1d3b24", "#b07c3c", "#e9d8a6"],
    ["#3a1d5c", "#e0b84a", "#f5e9c8"],
    ["#121214", "#a3202a", "#e04848"],
    ["#0f4a4a", "#e8dcc0", "#f7f1e1"],
    ["#e6dcc4", "#2c4a8a", "#1f3566"],
    ["#b8571a", "#1a1410", "#1a1410"],
    ["#3a7bbf", "#f2f2f2", "#ffffff"],
    ["#4a1626", "#b8bcc4", "#e3e6ea"],
    ["#4a4a1f", "#d8cfa8", "#f2ecd2"],
    ["#2c3440", "#e09a2c", "#f2b84a"],
    ["#ece7dc", "#9c1c1c", "#9c1c1c"],
    ["#0f5a3c", "#c9d1d6", "#eef3f5"],
    ["#0b1430", "#4cc3e0", "#9be7f7"],
    ["#7a3216", "#eadcc0", "#f6ecd8"],
    ["#c9a227", "#1c1a14", "#241f12"],
    ["#5a5f66", "#7a1212", "#f0e0e0"],
    ["#1c1c1c", "#e8e8e8", "#7fd36b"],
    ["#5c2a6e", "#e3c6f0", "#ffffff"],
    ["#8a6d1f", "#2a1d0c", "#f4e2a8"],
    ["#2a5d8f", "#f0c94a", "#f7e7a1"],
    ["#3b2a1a", "#c27b4a", "#f0c79a"],
    ["#a8323e", "#f2eadc", "#1f1414"],
];

export function mockCrest(seed: string, faction: string): GuildCrestDto {
    const random = mockRandom(`crest:${seed}`);
    const [backgroundColor, borderColor, emblemColor] = pickOne(random, CREST_PALETTES);
    return {
        emblem: Math.floor(random() * CREST_EMBLEM_COUNT),
        emblemColor,
        border: Math.floor(random() * CREST_BORDER_COUNT),
        borderColor,
        backgroundColor,
        faction,
    };
}

export const GUARDIANS_CREST: GuildCrestDto = {
    emblem: 42,
    emblemColor: "#e9d8a6",
    border: 3,
    borderColor: "#b07c3c",
    backgroundColor: "#1d3b24",
    faction: "alliance",
};

export const BLACKROCK_CREST: GuildCrestDto = {
    emblem: 7,
    emblemColor: "#e8eef7",
    border: 1,
    borderColor: "#c0c8d4",
    backgroundColor: "#14254a",
    faction: "horde",
};

export const MOONWELL_CREST: GuildCrestDto = {
    emblem: 19,
    emblemColor: "#ffffff",
    border: 2,
    borderColor: "#e3c6f0",
    backgroundColor: "#5c2a6e",
    faction: "alliance",
};

export const ASHEN_CREST: GuildCrestDto = {
    emblem: 11,
    emblemColor: "#f7f1e1",
    border: 4,
    borderColor: "#e8dcc0",
    backgroundColor: "#0f4a4a",
    faction: "horde",
};

export const STORMWATCH_CREST: GuildCrestDto = {
    emblem: 28,
    emblemColor: "#f3e3b5",
    border: 5,
    borderColor: "#d4af37",
    backgroundColor: "#6b1414",
    faction: "alliance",
};

export const EMBERHOLD_CREST: GuildCrestDto = {
    emblem: 15,
    emblemColor: "#1a1410",
    border: 6,
    borderColor: "#1a1410",
    backgroundColor: "#b8571a",
    faction: "horde",
};
