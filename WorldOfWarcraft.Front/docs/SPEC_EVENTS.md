# Spec — Events

Événements in-game et inscription de personnages, notifications, partage / SEO, rosters de raid, badges guilde dans le shell.

## Décisions verrouillées

- **Events** : entité jeu (pas les events site). Inscription par **personnage**.
- **Rosters** : `Roster` / `RosterMember` existent déjà en base — les exposer.
- **Notifications** : kinds jeu poussés vers les notifications shell, pas une boîte parallèle.
- **Badges shell** : `UserGroupRole` câblé sur `Guild.Id`. Source de vérité membership reste ici.
- **SEO / share** : Open Graph sur fiche joueur, guilde, event.
- **API Blizzard** : jamais au lancement.

## D1 — Events in-game

- [ ] Events + inscription de personnages
- [ ] Front : liste / détail / inscription, rail hub branché sur le réel
- [ ] Gateway resources

## D2 — Rosters de raid

- [ ] Exposer `Roster` / `RosterMember`
- [ ] Front : composition de roster

## D3 — Notifications + badges shell

- [ ] Publish notifications (candidature, event, post modéré)
- [ ] Sync `UserGroupRole` à l’acceptation / kick / leave / disband / transfer
- [ ] Profil public : badges guilde

## D4 — Share / SEO

- [ ] Titles + descriptions i18n (`wow.*`) sur les routes publiques
- [ ] Cartes de partage (joueur, guilde, event)

## Hors scope

- API Blizzard / import automatique
- Voice / salon persistant
