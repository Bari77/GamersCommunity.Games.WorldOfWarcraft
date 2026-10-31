# WorldOfWarcraft.Front — Angular i18n (JSON)

## Source language

**English (`en-US`) is the only language in source code** (templates, `$localize` defaults).

- Do **not** put French in HTML/TS sources.
- French lives only in `src/locale/fr-FR.json` (filled later).
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

Extracts `src/locale/en-US.json`, then folds the ids back into `src/locale/en-US/` and `src/locale/fr-FR/`. A new French id keeps the English text until it is translated.

## Dynamic keys from database seeds

WoW catalog `Entitled` values are lowercase snake_case. Build message IDs as:

| Domain    | Pattern                     | Example                  |
| --------- | --------------------------- | ------------------------ |
| Class     | `wow.class.` + entitled     | `wow.class.demon_hunter` |
| Race      | `wow.race.` + entitled      | `wow.race.night_elf`     |
| Alignment | `wow.alignment.` + entitled | `wow.alignment.alliance` |
| Direction | `wow.direction.` + entitled | `wow.direction.tank`     |
| Server    | `wow.server.` + entitled    | `wow.server.archimonde`  |

## Federation

Each remote ships its own localized bundles. Serve the remote in the **same locale** as the shell (`en-US` by default; `fr-FR` later). The shell does not embed WoW translation files.

## Folder layout

```
src/locale/
  en-US/        # English sources, one JSON file per area
  fr-FR/        # French translations, same files
  en-US.json    # generated catalog read by the Angular compiler
  fr-FR.json    # generated catalog
```

`node prebuild.js` concatenates each folder into the catalog Angular compiles. The `prebuild` npm script runs it before `npm run build`. Edit the files inside `en-US/` and `fr-FR/`.

When a message id is also the prefix of a longer id, its text lives on `.label` (`wow.home.lfg.label` next to `wow.home.lfg.empty`). A JSON object cannot be both a string and a group.

Babelary (`gc-wow`) reads the folders with `files: "{locale}/{name}.json"`. The token stays in `BABELARY_TOKEN`. `npm run i18n:push:sources`, `npm run i18n:push:translations`, and `npm run i18n:pull` sync `src/locale`.
