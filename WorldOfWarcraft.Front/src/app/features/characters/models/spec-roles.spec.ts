import { roleLabel, specKey, specRole } from "./spec-roles";

describe("spec-roles", () => {
    it("builds seeded specialization keys", () => {
        expect(specKey("warrior", "protection")).toBe("warrior_protection");
        expect(specKey("mage", null)).toBeNull();
    });

    it("maps tank/healer/dps from seeded titles", () => {
        expect(specRole("warrior_protection")).toBe("tank");
        expect(specRole("priest_holy")).toBe("healer");
        expect(specRole("mage_fire")).toBe("dps");
        expect(roleLabel("tank")).toContain("Tank");
    });
});
