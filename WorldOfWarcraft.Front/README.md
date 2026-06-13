# WorldOfWarcraft.Front

Micro-frontend Angular (Native Federation) pour le jeu World of Warcraft.

## Rôle

Ce projet est un **remote** fédéré, consommé par le shell `GamersCommunity.Front` via `loadRemoteModule`.

- **Port dev** : `4201`
- **Entrée fédérée** : `./Routes` → `worldOfWarcraftRoutes`

## Structure

```
src/app/
├── core/           # stores transverses (LoadingStore)
├── shared/         # BaseService, composants partagés
├── features/       # domaines métier (classes, …)
├── pages/          # pages avec resolvers
└── world-of-warcraft.routes.ts
```

## Patterns

- **Stores** : `@Injectable()` + `signal` / `resource()` + injection des services HTTP
- **Resolvers** : `resolve: { load: xxxResolver }` qui appellent `store.reload()` puis `store.loaded()`
- **Pages** : consomment directement les stores via `inject()`

## Démarrage

```bash
npm install
npm start
```

Pour tester avec le shell :

```bash
# Terminal 1 — remote WoW
npm start

# Terminal 2 — shell GamersCommunity.Front
cd ../../GamersCommunity.Front
npm run dev:federation
```

Ou depuis le shell uniquement :

```bash
npm run dev:federation
```

## API

Les services HTTP ciblent le gateway : `/api/worldofwarcraft/{Resource}`.

Exemple : `ClassesService` → `GET /api/worldofwarcraft/Classes`
