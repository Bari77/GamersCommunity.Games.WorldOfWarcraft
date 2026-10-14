/// <reference types="@angular/localize" />

import { PlaygroundPersonaCard, PlaygroundPersonaTag } from "@bari77/gc-playground/components";
import { gameTerm } from "@shared/pipes/game-term.pipe";
import { mockCharacters, sheetByNickname } from "./characters";
import { MockPersona, mockPortraitUrl } from "./personas";

const MAX_CHARACTER_TAGS = 4;

type PreviewCharacter = (typeof mockCharacters)[number];

export function personaCard(persona: MockPersona): PlaygroundPersonaCard {
    const sheet = sheetByNickname(persona.nickname);
    const characters = mockCharacters
        .filter((item) => item.playerPublicId === sheet.publicId)
        .sort((left, right) => Number(right.main) - Number(left.main) || right.level - left.level);
    const main = characters.find((item) => item.main) ?? characters[0];

    return {
        id: persona.id,
        nickname: persona.nickname,
        discriminator: persona.discriminator,
        avatarUrl: mockPortraitUrl(persona.nickname),
        headline: main
            ? $localize`:@@wow.playground.persona.main:Main · ${main.pseudo}:pseudo:, ${gameTerm(main.mainSpecializationName)}:spec: ${gameTerm(main.className)}:class:`
            : $localize`:@@wow.playground.persona.noMain:No character`,
        stats: [
            { label: $localize`:@@wow.playground.persona.stat.characters:Characters`, value: characters.length },
            { label: $localize`:@@wow.playground.persona.stat.ilvl:Best ilvl`, value: best(characters, "ilvl") },
            {
                label: $localize`:@@wow.playground.persona.stat.achievements:Achievements`,
                value: best(characters, "achievement").toLocaleString("en-US"),
            },
            { label: $localize`:@@wow.playground.persona.stat.mounts:Mounts`, value: sheet.nbMount },
        ],
        details: [
            {
                label: $localize`:@@wow.playground.persona.detail.characters:Characters`,
                tags: characterTags(characters),
                empty: $localize`:@@wow.playground.persona.noCharacter:None yet`,
            },
            {
                label: $localize`:@@wow.playground.persona.detail.guilds:Guilds`,
                tags: guildTags(characters, sheet.guild ?? null),
                empty: $localize`:@@wow.playground.persona.noGuild:No guild`,
            },
            {
                label: $localize`:@@wow.playground.persona.detail.servers:Servers`,
                tags: [...new Set(characters.map((item) => gameTerm(item.serverName)).filter(Boolean))].map((text) => ({
                    text,
                })),
            },
        ],
    };
}

function best(characters: PreviewCharacter[], key: "ilvl" | "achievement"): number {
    return characters.reduce((max, item) => Math.max(max, item[key] ?? 0), 0);
}

function characterTags(characters: PreviewCharacter[]): PlaygroundPersonaTag[] {
    const tags: PlaygroundPersonaTag[] = characters.slice(0, MAX_CHARACTER_TAGS).map((item) => ({
        text: item.pseudo,
        hint: `${item.level} ${gameTerm(item.className)}`,
    }));
    const extra = characters.length - MAX_CHARACTER_TAGS;
    if (extra > 0) {
        tags.push({ text: `+${extra}` });
    }
    return tags;
}

function guildTags(
    characters: { guildName?: string | null; guildRank?: string | null }[],
    sheetGuild: { entitled: string; rank: string } | null,
): PlaygroundPersonaTag[] {
    const guilds = new Map<string, string | null>();
    for (const character of characters) {
        if (character.guildName && !guilds.has(character.guildName)) {
            guilds.set(character.guildName, character.guildRank ?? null);
        }
    }
    if (guilds.size === 0 && sheetGuild) {
        guilds.set(sheetGuild.entitled, sheetGuild.rank);
    }
    return [...guilds.entries()].map(([text, rank]) => ({ text, hint: rank ? gameTerm(rank) : null }));
}
