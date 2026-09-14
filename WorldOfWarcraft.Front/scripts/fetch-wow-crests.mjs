// Downloads the World of Warcraft guild tabard parts served by the Blizzard render CDN into
// public/wow-crests. The artwork belongs to Blizzard, so it stays out of git: run
// `npm run crests` after cloning.
//
// A crest is layered the way the game builds a tabard: the faction ring, a background colour,
// a border shape and an emblem on top. Blizzard ships the shapes uncoloured, so the front end
// tints them with CSS masks and only needs the raw silhouettes stored here.

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const CDN = "https://render.worldofwarcraft.com/eu/guild/tabards";
const OUTPUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "wow-crests");

// The CDN answers 403 to anything that does not look like a browser.
const HEADERS = {
    "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
};

/** Highest emblem and border the CDN serves; anything above answers 403. */
const LAST_EMBLEM = 195;
const LAST_BORDER = 6;

const pad = (index) => String(index).padStart(2, "0");

const groups = {
    emblems: Array.from({ length: LAST_EMBLEM + 1 }, (_, index) => [pad(index), `emblem_${pad(index)}`]),
    borders: Array.from({ length: LAST_BORDER + 1 }, (_, index) => [pad(index), `border_${pad(index)}`]),
    frames: [
        ["alliance", "ring-alliance"],
        ["horde", "ring-horde"],
        ["flag", "bg_00"],
        ["hooks", "hooks"],
    ],
};

async function download(folder, slug, asset) {
    const url = `${CDN}/${asset}.png`;
    const response = await fetch(url, { headers: HEADERS });
    if (!response.ok) {
        throw new Error(`${response.status} ${url}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(join(OUTPUT, folder, `${slug}.png`), buffer);
}

const failures = [];
let downloaded = 0;

for (const [folder, entries] of Object.entries(groups)) {
    await mkdir(join(OUTPUT, folder), { recursive: true });
    for (const [slug, asset] of entries) {
        try {
            await download(folder, slug, asset);
            downloaded += 1;
        } catch (error) {
            failures.push(`${folder}/${slug}: ${error.message}`);
        }
    }
}

console.log(`Downloaded ${downloaded} crest parts into public/wow-crests`);
if (failures.length > 0) {
    console.error(`Failed:\n  ${failures.join("\n  ")}`);
    process.exit(1);
}
