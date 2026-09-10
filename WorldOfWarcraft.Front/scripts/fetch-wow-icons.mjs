// Downloads the World of Warcraft icons served by the Wowhead CDN into public/wow-icons.
// The artwork belongs to Blizzard, so it stays out of git: run `npm run icons` after cloning.
//
// Local file names are the `Entitled` values seeded in WorldOfWarcraft.Database, so the app
// resolves an icon straight from the reference data without any extra lookup table.

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const CDN = "https://wow.zamimg.com/images/wow/icons/large";
const OUTPUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "wow-icons");

const classes = {
    warrior: "classicon_warrior",
    paladin: "classicon_paladin",
    hunter: "classicon_hunter",
    rogue: "classicon_rogue",
    priest: "classicon_priest",
    shaman: "classicon_shaman",
    mage: "classicon_mage",
    warlock: "classicon_warlock",
    monk: "classicon_monk",
    druid: "classicon_druid",
    demon_hunter: "classicon_demonhunter",
    death_knight: "classicon_deathknight",
    evoker: "classicon_evoker",
};

const races = {
    human: "race_human_male",
    orc: "race_orc_male",
    dwarf: "race_dwarf_male",
    night_elf: "race_nightelf_male",
    undead: "race_scourge_male",
    tauren: "race_tauren_male",
    gnome: "race_gnome_male",
    troll: "race_troll_male",
    blood_elf: "race_bloodelf_male",
    draenei: "race_draenei_male",
    worgen: "race_worgen_male",
    goblin: "race_goblin_male",
    pandaren: "race_pandaren_male",
    vulpera: "race_vulpera_male",
    dracthyr: "race_dracthyr_male",
};

const specs = {
    warrior_arms: "ability_warrior_savageblow",
    warrior_fury: "ability_warrior_innerrage",
    warrior_protection: "ability_warrior_defensivestance",
    paladin_holy: "spell_holy_holybolt",
    paladin_protection: "ability_paladin_shieldofthetemplar",
    paladin_retribution: "spell_holy_auraoflight",
    hunter_beast_mastery: "ability_hunter_bestialdiscipline",
    hunter_marksmanship: "ability_hunter_focusedaim",
    hunter_survival: "ability_hunter_camouflage",
    rogue_assassination: "ability_rogue_deadlybrew",
    rogue_outlaw: "inv_sword_30",
    rogue_subtlety: "ability_stealth",
    priest_discipline: "spell_holy_powerwordshield",
    priest_holy: "spell_holy_guardianspirit",
    priest_shadow: "spell_shadow_shadowwordpain",
    shaman_elemental: "spell_nature_lightning",
    shaman_enhancement: "spell_shaman_improvedstormstrike",
    shaman_restoration: "spell_nature_magicimmunity",
    mage_arcane: "spell_holy_magicalsentry",
    mage_fire: "spell_fire_firebolt02",
    mage_frost: "spell_frost_frostbolt02",
    warlock_affliction: "spell_shadow_deathcoil",
    warlock_demonology: "spell_shadow_metamorphosis",
    warlock_destruction: "spell_shadow_rainoffire",
    monk_brewmaster: "spell_monk_brewmaster_spec",
    monk_mistweaver: "spell_monk_mistweaver_spec",
    monk_windwalker: "spell_monk_windwalker_spec",
    druid_balance: "spell_nature_starfall",
    druid_feral: "ability_druid_catform",
    druid_guardian: "ability_racial_bearform",
    druid_restoration: "spell_nature_healingtouch",
    demon_hunter_havoc: "ability_demonhunter_specdps",
    demon_hunter_vengeance: "ability_demonhunter_spectank",
    death_knight_blood: "spell_deathknight_bloodpresence",
    death_knight_frost: "spell_deathknight_frostpresence",
    death_knight_unholy: "spell_deathknight_unholypresence",
    evoker_devastation: "classicon_evoker_devastation",
    evoker_preservation: "classicon_evoker_preservation",
    evoker_augmentation: "classicon_evoker_augmentation",
};

// Role glyphs are not downloaded: the CDN only mirrors Interface/Icons, and the group-finder
// shield, cross and sword live in a UI sprite sheet. WowIconComponent draws them instead.
const groups = { classes, races, specs };

async function download(folder, slug, icon) {
    const response = await fetch(`${CDN}/${icon}.jpg`);
    if (!response.ok) {
        throw new Error(`${response.status} ${CDN}/${icon}.jpg`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(join(OUTPUT, folder, `${slug}.jpg`), buffer);
}

const failures = [];
let downloaded = 0;

for (const [folder, entries] of Object.entries(groups)) {
    await mkdir(join(OUTPUT, folder), { recursive: true });
    for (const [slug, icon] of Object.entries(entries)) {
        try {
            await download(folder, slug, icon);
            downloaded += 1;
        } catch (error) {
            failures.push(`${folder}/${slug}: ${error.message}`);
        }
    }
}

console.log(`Downloaded ${downloaded} icons into public/wow-icons`);
if (failures.length > 0) {
    console.error(`Failed:\n  ${failures.join("\n  ")}`);
    process.exit(1);
}
