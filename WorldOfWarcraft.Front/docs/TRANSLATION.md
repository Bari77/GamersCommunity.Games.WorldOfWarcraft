# WorldOfWarcraft.Front — Angular i18n (JSON)

## Source language

**English (`en-US`) is the only language in source code** (templates, `$localize` defaults).

- Do **not** put French in HTML/TS sources.
- French lives only in `src/locale/source.fr.json` (filled later).
- `angular.json` → `i18n.sourceLocale: "en-US"`.

This remote owns **WoW-only** strings. Shell UI stays in GamersCommunity.Front. Use the **`wow.*`** key prefix so catalogs never collide under federation.

## Marking text

### HTML

```html
<h1 i18n="@@wow.home.title">World of Warcraft</h1>
```

### TypeScript

```ts
const label = $localize`:@@wow.class.demon_hunter:Demon Hunter`;
```

## Extracting the English catalog

```bash
npm run i18n
```

Writes / updates `src/locale/source.json`.

## Dynamic keys from database seeds

WoW catalog `Entitled` values are lowercase snake_case. Build message IDs as:

| Domain | Pattern | Example |
| --- | --- | --- |
| Class | `wow.class.` + entitled | `wow.class.demon_hunter` |
| Race | `wow.race.` + entitled | `wow.race.night_elf` |
| Alignment | `wow.alignment.` + entitled | `wow.alignment.alliance` |
| Direction | `wow.direction.` + entitled | `wow.direction.tank` |
| Server | `wow.server.` + entitled | `wow.server.archimonde` |

## Federation

Each remote ships its own localized bundles. Serve the remote in the **same locale** as the shell (`en-US` by default; `fr` later). The shell does not embed WoW translation files.

## Folder layout

```
src/locale/
  source.json       # extracted EN catalog
  source.fr.json    # French (deferred)
```
