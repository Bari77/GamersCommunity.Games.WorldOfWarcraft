# WorldOfWarcraft.Front

Angular remote (Native Federation) — port `4201`, exposes `./Routes`.

## Modes

### UI-only (mocks) — default

```bash
# NODE_AUTH_TOKEN = PAT read:packages
npm install
npm start
```

Packages: `@bari77/gc-sdk`, `@bari77/gc-msw`, `@bari77/gc-playground` (GitHub Packages).

### Game-full

Compose stack at the repo root, then:

```bash
npm run start:api
```

### Platform (Shell)

The Shell team loads `remoteEntry.json`; this remote does **not** use an iframe — see platform federation docs.
