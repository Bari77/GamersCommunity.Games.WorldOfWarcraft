# World of Warcraft — product vision (locked)

MMORPG remote. Player sheet, characters, guilds, LFG, moderated guild wall, in-game events. No Blizzard API at launch — players enter sheet data manually.

## This remote owns

Hub, player sheet, characters (realm / race / class / spec), guilds, LFG, moderated guild wall, in-game events and character signup.

The site identity, profile wall, friends, DMs, site events and notifications live on the shell.

## Content

| Content | Owner |
|---------|-------|
| Hub / guild wall + LFG | This remote |
| In-game events + character signup | This remote |
| Profile wall, friends, DMs, site events, notifications | Shell |

A character belongs to at most one guild. A player can be in several guilds through different characters. `GuildMember` is the membership source of truth.

## Specs

| Spec | Focus |
|------|--------|
| Player sheet | Identity bridge, characters, media, widgets, hub rails |
| Guilds | Moderated wall, LFG board, mute enforcement |
| Events | In-game events, raid rosters, notifications, guild badges, share / SEO |

## Display vs technical keys

- **Display**: `World Of Warcraft`, human labels (class names, realm names)
- **Technical**: `UrlValue` `/world-of-warcraft`, codes (`wow.*`) for routes, assets, i18n
