# Spec — Guilds

Gouvernance de guilde, mur modéré par les officiers, board LFG avec filtres, enforcement serveur du mute. Les événements in-game et les notifications restent dans spec Events.

## Décisions verrouillées

- **Clé publique guilde** : `Guild.PublicId` (GUID). Handle = `Entitled#Discriminator`, index unique sur le couple.
- **Rangs** : `GuildMember.IdGuildRank` est la seule source de vérité (`leader` / `officer` / `member`). Les badges shell (`UserGroupRole`) restent vides jusqu’à spec Events.
- **Appartenance** : `GuildMember` uniquement. `Character.IdGuild` (FK legacy) est supprimée.
- **Leader** : `Guild.IdLeader` est le pointeur canonique et doit toujours avoir un `GuildMember` `leader` en regard. Écrits dans la même transaction.
- **Un personnage, une guilde.** Un joueur peut être dans plusieurs guildes via des personnages différents.
- **Candidatures** : `GuildApplication` (candidat = `Character`, statut `pending` / `accepted` / `rejected` / `withdrawn`). Une seule `pending` par couple (guilde, personnage).
- **Mur modéré** : `GamePost` + `GamePostStatus`. Leader et officiers publient en `approved` ; les membres passent en `pending`.
- **Pas de deep-link DM.** Parcours : LFG guilde → fiche guilde → roster → pseudo → profil public → ami → Whispers.
- **Mute** : RPC synchrone vers `platform_queue` (`Users.Sanctions`), cache mémoire court. Sanctions jamais répliquées en base jeu.
- **Client RPC** : local au Consumer. À partager plus tard si un autre remote en a besoin.
- **Tables legacy supprimées** : `GuildMessages`, `GuildRequests`.

## C1 — Gouvernance de guilde

- [x] Migration `GuildGovernance` : `GuildApplication` + statuts, colonnes de modération sur `GamePost`, drop `GuildMessages` / `GuildRequests` / `Character.IdGuild`
- [x] Seed `GuildApplicationStatus` (`pending`, `accepted`, `rejected`, `withdrawn`)
- [x] `Guilds.Search` (public) : nom, filtres serveur / faction, pagination curseur
- [x] `Guilds.Create` (auth) : personnage fondateur sans guilde, handle unique, member leader dans la même transaction
- [x] `Guilds.Update` / `SetRank` / `Kick` / `Leave` / `TransferLeadership` / `Disband`
- [x] `Guilds.Get` enrichi : effectif, rang du visiteur, état de sa candidature
- [x] `GuildApplications` : Create / ListMine / Withdraw / List / Review
- [x] Projections `Characters` et `HomeFeed` rebranchées sur `GuildMember`
- [x] Front : annuaire `/world-of-warcraft/guilds`, fiche enrichie

## C2 — Mur de guilde modéré

- [x] `GamePosts.ListGuildWall` / `Create` / `ListPending` / `Moderate` / `Delete`
- [x] Front : mur, composeur, file de modération pour leader et officiers

## C3 — Board LFG

- [x] `LfgAds.Search` : filtres `kind` / serveur / rôle
- [x] `LfgAds.Create` estampille serveur et rôle
- [x] Page `/world-of-warcraft/lfg`
- [x] Annonce de guilde → fiche de guilde ; annonce de joueur → fiche joueur

## C4 — Enforcement du mute

- [x] Action interne `Users.Sanctions` (non exposée au Gateway)
- [x] Client RPC + cache mémoire court
- [x] Garde `EnsureCanPublishAsync` sur LFG, posts, candidatures
- [x] Ban actif : blocage des publications
- [x] Front : erreurs `MUTED` / `BANNED` / `SANCTIONS_UNAVAILABLE`

## Gateway

| Resource | Public | Private (auth) |
|----------|--------|----------------|
| Guilds | Get, Search | ListPostable, Create, Update, SetRank, Kick, Leave, TransferLeadership, Disband |
| GuildApplications | — | Create, ListMine, Withdraw, List, Review |
| GamePosts | ListGuildWall | Create, ListPending, Moderate, Delete |
| LfgAds | ListRecent, ListBefore, Search | Create |

`Users.Sanctions` reste hors table de routage.

## Matrice de permissions

| Action | Visiteur | Membre | Officier | Leader |
|--------|----------|--------|----------|--------|
| Voir la fiche et le mur | oui | oui | oui | oui |
| Candidater | oui (connecté) | — | — | — |
| Publier sur le mur | non | oui (`pending`) | oui (`approved`) | oui (`approved`) |
| Modérer le mur | non | non | oui | oui |
| Traiter les candidatures | non | non | oui | oui |
| Exclure un membre | non | non | oui (rang inférieur) | oui |
| Éditer la fiche | non | non | oui | oui |
| Changer les rangs | non | non | non | oui |
| Transférer / dissoudre | non | non | non | oui |

## Hors scope

- Événements in-game et inscription de personnages — spec Events
- Notifications, partage / SEO — spec Events
- Rosters de raid (`Roster`, `RosterMember` déjà en base) — spec Events
- Badges guilde côté shell — spec Events
- Partage du client RPC — plus tard
- API Blizzard — jamais au lancement
