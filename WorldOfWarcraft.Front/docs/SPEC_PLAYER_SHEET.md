# Spec — Player sheet

Pont identité shell ↔ microservice, fiche joueur publique, rails sur la home. Les guildes, le mur modéré et le LFG complet restent dans spec Guilds ; le layout widgets est une sous-étape de cette spec.

## Décisions verrouillées

- **Clé publique fiche** : `Player.PublicId` (GUID), pas l’id shell.
- **Lien depuis le profil public** : `/users/:platformPublicId` → `Players.Resolve` → `/world-of-warcraft/players/:playerPublicId`.
- **Identité** : `Player.IdKeycloak` + `Player.PlatformUserPublicId` (index uniques), `IdUser` renseigné au `Load`.
- **Mute LFG** : bannière + masquage UI côté shell ici ; enforcement Consumer dans spec Guilds.
- **Widgets** : `@bari77/gc-widgets` (grille + hosts), `angular-gridster2` v21.
- **Layout widgets** : JSON opaque dans `Player.LayoutJson` ; visible par tous, éditable par le seul propriétaire.
- **Workspace multi-pages** : `LayoutJson` porte `{ version: 2, pages: [...] }`. Les tableaux plats v1 sont migrés à la lecture vers la première page.
- **Médias profil** : `PlayerPicture` / `PlayerVideo` / `PlayerStream` stockent des URL ; `Share` décide de la visibilité publique.
- **Fédération** : `@bari77/gc-widgets` livre du `.ts` brut, il reste dans `skip` de `federation.config.mjs`.

## B1 — Identité & fiche joueur

- [x] Migration `Player` : `IdKeycloak`, `PlatformUserPublicId` (index uniques filtrés)
- [x] `Players.Load` (auth) : get-or-create par Keycloak + ids shell
- [x] `Players.Get` (public) : fiche par `Player.PublicId`
- [x] `Players.Resolve` (public) : `{ platformUserPublicId }` → `{ playerPublicId? }`
- [x] `Players.Update` (auth) : présentations IRL / IG, propre fiche uniquement
- [x] Routes : `/world-of-warcraft/sheet`, `/world-of-warcraft/players/:publicId`
- [x] Profil public : section « Jeux » avec lien si fiche existante

## B2 — Personnages (CRUD minimal)

- [x] Seeds `Specialization` (35), `SpecializationClass` (39), `RaceClass` (124) — `Order = 1` sur les jonctions
- [x] `Characters` : Create / Get / List (par joueur) / Update / Delete
- [x] `Characters.Options` (public) : races, serveurs, rôles, factions, classes, specs, matrice race/classe
- [x] Validations : nom unique par serveur, spec cohérente avec la classe, classe autorisée pour la race
- [x] UI fiche : cartes personnages aux couleurs de classe, formulaire création / édition, suppression confirmée
- [x] Personnage principal (`Main`) — un seul par joueur, promotion auto du suivant à la suppression

## B3 — Médias profil & layout widgets

- [x] `PlayerPicture`, `PlayerVideo`, `PlayerStream` — List (public, filtré sur `Share`) / Create / Update / Delete (propriétaire)
- [x] Colonne `LayoutJson` sur `Player` — écrite via `Players.Update`, lue par tous
- [x] `@bari77/gc-widgets` : workspace, grille, catalogue, barre d’édition
- [x] Widgets : identité, présentation IRL, présentation IG, stats, persos, galerie photo, galerie vidéo, streams, lecteur Twitch, liens
- [x] Pages par défaut : accueil (verrouillée), personnages, vidéos, photos, liens
- [x] Remplacer la référence `file:.tmp-packs/...` par la version registry

## B4 — Home (rails)

- [x] `HomeFeed.Get` : derniers LFG actifs, persos créés, fiches joueur, événements à venir
- [x] Rail LFG : tchat global chronologique + SignalR (`/hubs/wow-lfg`)
- [x] `LfgAds.Create` (auth) : titre, corps, kind, expiration
- [x] MSW handlers pour dev standalone (`useMocks: true`)

## Gateway

| Resource | Public | Private (auth) |
|----------|--------|----------------|
| Players | Get, Resolve | Load, Update |
| HomeFeed | Get | — |
| LfgAds | ListRecent | Create |
| Characters | Get, List, Options | Create, Update, Delete |
| PlayerPictures | List | Create, Update, Delete |
| PlayerVideos | List | Create, Update, Delete |
| PlayerStreams | List | Create, Update, Delete |

## Hors scope

- Guildes, mur de guilde, modération — spec Guilds
- Événements in-game (inscription perso) — spec Events
- API Blizzard / import auto — jamais au lancement

## Matrice d’accès

| Visiteur | Profil public | Fiche joueur |
|----------|---------------|--------------|
| Anonyme | identité publique | fiche publique si existe |
| Connecté | + amis / DM / report | + lien depuis le profil |
| Propriétaire | édition profil | `Load` + `Update` fiche + layout |
