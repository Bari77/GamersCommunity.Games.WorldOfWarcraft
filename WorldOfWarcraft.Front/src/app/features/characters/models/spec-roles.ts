export type WowRole = "tank" | "healer" | "dps";

// Keys match SpecializationClass.Entitled seeded in WorldOfWarcraft.Database.
const TANKS = new Set([
    "warrior_protection",
    "paladin_protection",
    "druid_guardian",
    "monk_brewmaster",
    "demon_hunter_vengeance",
    "death_knight_blood",
]);

const HEALERS = new Set([
    "paladin_holy",
    "priest_discipline",
    "priest_holy",
    "shaman_restoration",
    "monk_mistweaver",
    "druid_restoration",
    "evoker_preservation",
]);

export function specKey(className: string | null | undefined, specName: string | null | undefined): string | null {
    return className && specName ? `${className}_${specName}` : null;
}

export function specRole(key: string | null | undefined): WowRole | null {
    if (!key) {
        return null;
    }
    if (TANKS.has(key)) {
        return "tank";
    }
    if (HEALERS.has(key)) {
        return "healer";
    }
    return "dps";
}

export function roleLabel(role: WowRole): string {
    switch (role) {
        case "tank":
            return $localize`:@@wow.role.tank:Tank`;
        case "healer":
            return $localize`:@@wow.role.healer:Healer`;
        case "dps":
            return $localize`:@@wow.role.dps:DPS`;
    }
}
