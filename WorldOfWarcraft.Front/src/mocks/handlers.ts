import { createGatewayListHandler, gatewayUrl } from "@bari77/gc-msw";
import { CharacterCreateRequestDto, CharacterDto } from "@features/characters/dto/character.dto";
import { GamePostDto } from "@features/guilds/dto/game-post.dto";
import { GuildApplicationDto } from "@features/guilds/dto/guild-application.dto";
import { GuildSheetDto } from "@features/guilds/dto/guild.dto";
import {
    PlayerLinkCreateRequestDto,
    PlayerLinkDto,
    PlayerLinkReorderRequestDto,
} from "@features/links/dto/player-link.dto";
import { PlayerMediaCreateRequestDto, PlayerMediaDto } from "@features/media/dto/player-media.dto";
import { PlayerUpdateRequestDto } from "@features/players/dto/player.dto";
import { http, HttpResponse } from "msw";
import { environment } from "../environments/environment";
import {
    buildMockCharacter,
    mockCharacterOptions,
    mockCharacters,
    mockPlayerSheet,
    PLATFORM_USER_PUBLIC_ID,
    PLAYER_PUBLIC_ID,
} from "./data/characters";
import { mockClasses } from "./data/classes";
import {
    mockGuildApplications,
    mockGuildSheet,
    mockGuildSummaries,
    mockGuildWallPosts,
    mockPendingPosts,
} from "./data/guilds";
import { mockHomeFeed, mockLfgMessages, mockPostableGuilds, mockRecruitmentMessages } from "./data/home-feed";
import { mockPlayerLinks } from "./data/links";
import { mockPlayerPictures, mockPlayerStreams, mockPlayerVideos } from "./data/media";

const charactersUrl = gatewayUrl(environment.apiUrl, "worldofwarcraft", "Characters");
const playersUrl = gatewayUrl(environment.apiUrl, "worldofwarcraft", "Players");
const linksUrl = gatewayUrl(environment.apiUrl, "worldofwarcraft", "PlayerLinks");

let characters: CharacterDto[] = [...mockCharacters];
let layoutJson: string | null = mockPlayerSheet.layoutJson;

/** `?noSheet` in the URL browses as a logged-in visitor who has no player sheet yet. */
let hasPlayerSheet = !new URLSearchParams(location.search).has("noSheet");

const mediaStore: Record<string, PlayerMediaDto[]> = {
    PlayerPictures: [...mockPlayerPictures],
    PlayerVideos: [...mockPlayerVideos],
    PlayerStreams: [...mockPlayerStreams],
};

const mediaHandlers = Object.keys(mediaStore).flatMap((resource) => {
    const base = gatewayUrl(environment.apiUrl, "worldofwarcraft", resource);
    return [
        http.post(`${base}/actions/List`, () => HttpResponse.json(mediaStore[resource])),
        http.post(`${base}/actions/Create`, async ({ request }) => {
            const body = (await request.json()) as PlayerMediaCreateRequestDto;
            const created: PlayerMediaDto = {
                publicId: crypto.randomUUID(),
                playerPublicId: PLAYER_PUBLIC_ID,
                url: body.url,
                caption: body.caption,
                share: body.share,
                creationDate: new Date().toISOString(),
            };
            mediaStore[resource] = [created, ...mediaStore[resource]];
            return HttpResponse.json(created);
        }),
        http.put(`${base}/:publicId`, async ({ request, params }) => {
            const publicId = params["publicId"] as string;
            const body = (await request.json()) as Partial<PlayerMediaCreateRequestDto>;
            mediaStore[resource] = mediaStore[resource].map((item) =>
                item.publicId === publicId ? { ...item, ...body } : item,
            );
            return HttpResponse.json(mediaStore[resource].find((item) => item.publicId === publicId));
        }),
        http.delete(`${base}/:publicId`, ({ params }) => {
            const publicId = params["publicId"] as string;
            mediaStore[resource] = mediaStore[resource].filter((item) => item.publicId !== publicId);
            return new HttpResponse(null, { status: 204 });
        }),
    ];
});

const guildsUrl = gatewayUrl(environment.apiUrl, "worldofwarcraft", "Guilds");
const guildApplicationsUrl = gatewayUrl(environment.apiUrl, "worldofwarcraft", "GuildApplications");
const gamePostsUrl = gatewayUrl(environment.apiUrl, "worldofwarcraft", "GamePosts");

let guildSheet: GuildSheetDto = { ...mockGuildSheet };
let guildApplications: GuildApplicationDto[] = [...mockGuildApplications];
let wallPosts: GamePostDto[] = [...mockGuildWallPosts];
let pendingPosts: GamePostDto[] = [...mockPendingPosts];

const guildHandlers = [
    http.post(`${guildsUrl}/actions/Search`, async ({ request }) => {
        const { query } = (await request.json()) as { query?: string };
        const needle = query?.trim().toLowerCase();
        const items = needle
            ? mockGuildSummaries.filter((guild) => guild.entitled.toLowerCase().includes(needle))
            : mockGuildSummaries;
        return HttpResponse.json({ items, hasMore: false });
    }),
    http.post(`${guildsUrl}/actions/ListPostable`, () => HttpResponse.json(mockPostableGuilds)),
    http.get(`${guildsUrl}/${mockGuildSheet.publicId}`, () => HttpResponse.json(guildSheet)),
    http.post(guildsUrl, async ({ request }) => {
        const body = (await request.json()) as { entitled: string };
        guildSheet = { ...guildSheet, entitled: body.entitled, viewerRank: "leader" };
        return HttpResponse.json(guildSheet);
    }),
    http.put(`${guildsUrl}/:publicId`, async ({ request }) => {
        const body = (await request.json()) as Partial<GuildSheetDto>;
        guildSheet = { ...guildSheet, ...body };
        return HttpResponse.json(guildSheet);
    }),
    http.post(`${guildsUrl}/actions/SetRank`, async ({ request }) => {
        const { characterPublicId, rank } = (await request.json()) as { characterPublicId: string; rank: string };
        guildSheet = {
            ...guildSheet,
            members: guildSheet.members.map((member) =>
                member.characterPublicId === characterPublicId ? { ...member, rank } : member,
            ),
        };
        return HttpResponse.json(guildSheet);
    }),
    http.post(`${guildsUrl}/actions/Kick`, async ({ request }) => {
        const { characterPublicId } = (await request.json()) as { characterPublicId: string };
        const members = guildSheet.members.filter((member) => member.characterPublicId !== characterPublicId);
        guildSheet = { ...guildSheet, members, memberCount: members.length };
        return HttpResponse.json(guildSheet);
    }),
    http.post(`${guildsUrl}/actions/TransferLeadership`, async ({ request }) => {
        const { characterPublicId } = (await request.json()) as { characterPublicId: string };
        guildSheet = {
            ...guildSheet,
            viewerRank: "officer",
            members: guildSheet.members.map((member) => ({
                ...member,
                rank:
                    member.characterPublicId === characterPublicId
                        ? "leader"
                        : member.rank === "leader"
                          ? "officer"
                          : member.rank,
            })),
        };
        return HttpResponse.json(guildSheet);
    }),
    http.post(`${guildsUrl}/actions/Leave`, async ({ request }) => {
        const body = (await request.json()) as { guildPublicId: string; characterPublicId: string };
        const members = guildSheet.members.filter((member) => member.characterPublicId !== body.characterPublicId);
        guildSheet = { ...guildSheet, members, memberCount: members.length, viewerRank: null };
        return HttpResponse.json(body);
    }),
    http.post(`${guildsUrl}/actions/Disband`, async ({ request }) => {
        const { guildPublicId } = (await request.json()) as { guildPublicId: string };
        return HttpResponse.json({ publicId: guildPublicId, handle: guildSheet.entitled });
    }),
];

const guildApplicationHandlers = [
    http.post(`${guildApplicationsUrl}/actions/List`, () => HttpResponse.json(guildApplications)),
    http.post(`${guildApplicationsUrl}/actions/ListMine`, () => HttpResponse.json([])),
    http.post(`${guildApplicationsUrl}/actions/Create`, async ({ request }) => {
        const body = (await request.json()) as { characterPublicId: string; message: string };
        const created: GuildApplicationDto = {
            ...mockGuildApplications[0],
            publicId: crypto.randomUUID(),
            characterPublicId: body.characterPublicId,
            message: body.message,
            creationDate: new Date().toISOString(),
        };
        guildSheet = {
            ...guildSheet,
            viewerApplicationStatus: "pending",
            viewerApplicationPublicId: created.publicId,
        };
        return HttpResponse.json(created);
    }),
    http.post(`${guildApplicationsUrl}/actions/Review`, async ({ request }) => {
        const { publicId, accept } = (await request.json()) as { publicId: string; accept: boolean };
        const reviewed = guildApplications.find((item) => item.publicId === publicId) ?? mockGuildApplications[0];
        guildApplications = guildApplications.filter((item) => item.publicId !== publicId);
        return HttpResponse.json({
            ...reviewed,
            status: accept ? "accepted" : "rejected",
            reviewedAt: new Date().toISOString(),
        });
    }),
    http.post(`${guildApplicationsUrl}/actions/Withdraw`, async ({ request }) => {
        const { publicId } = (await request.json()) as { publicId: string };
        guildSheet = { ...guildSheet, viewerApplicationStatus: null, viewerApplicationPublicId: null };
        return HttpResponse.json({ ...mockGuildApplications[0], publicId, status: "withdrawn" });
    }),
];

const gamePostHandlers = [
    http.post(`${gamePostsUrl}/actions/ListGuildWall`, () => HttpResponse.json({ items: wallPosts, hasMore: false })),
    http.post(`${gamePostsUrl}/actions/ListPending`, () => HttpResponse.json({ items: pendingPosts, hasMore: false })),
    http.post(`${gamePostsUrl}/actions/Create`, async ({ request }) => {
        const body = (await request.json()) as { body: string; mediaUrl?: string | null };
        // The mocked visitor is an officer, so posts are published without review.
        const created: GamePostDto = {
            ...mockGuildWallPosts[0],
            publicId: crypto.randomUUID(),
            body: body.body,
            mediaUrl: body.mediaUrl ?? null,
            status: "approved",
            creationDate: new Date().toISOString(),
        };
        wallPosts = [created, ...wallPosts];
        return HttpResponse.json(created);
    }),
    http.post(`${gamePostsUrl}/actions/Moderate`, async ({ request }) => {
        const { publicId, approve } = (await request.json()) as { publicId: string; approve: boolean };
        const target = pendingPosts.find((item) => item.publicId === publicId) ?? mockPendingPosts[0];
        pendingPosts = pendingPosts.filter((item) => item.publicId !== publicId);
        const moderated: GamePostDto = {
            ...target,
            status: approve ? "approved" : "rejected",
            moderatedAt: new Date().toISOString(),
        };
        if (approve) {
            wallPosts = [moderated, ...wallPosts];
        }
        return HttpResponse.json(moderated);
    }),
    http.post(`${gamePostsUrl}/actions/Delete`, async ({ request }) => {
        const { publicId } = (await request.json()) as { publicId: string };
        wallPosts = wallPosts.filter((item) => item.publicId !== publicId);
        pendingPosts = pendingPosts.filter((item) => item.publicId !== publicId);
        return HttpResponse.json({ publicId });
    }),
];

let links: PlayerLinkDto[] = [...mockPlayerLinks];

const linkHandlers = [
    http.post(`${linksUrl}/actions/List`, () => HttpResponse.json(links)),
    http.post(`${linksUrl}/actions/Create`, async ({ request }) => {
        const body = (await request.json()) as PlayerLinkCreateRequestDto;
        const created: PlayerLinkDto = {
            publicId: crypto.randomUUID(),
            playerPublicId: PLAYER_PUBLIC_ID,
            url: body.url,
            label: body.label,
            icon: body.icon,
            position: links.length,
        };
        links = [...links, created];
        return HttpResponse.json(created);
    }),
    http.post(`${linksUrl}/actions/Reorder`, async ({ request }) => {
        const { publicIds } = (await request.json()) as PlayerLinkReorderRequestDto;
        links = links
            .map((item) => ({ ...item, position: publicIds.indexOf(item.publicId) }))
            .sort((a, b) => a.position - b.position);
        return HttpResponse.json(links);
    }),
    http.put(`${linksUrl}/:publicId`, async ({ request, params }) => {
        const publicId = params["publicId"] as string;
        const body = (await request.json()) as Partial<PlayerLinkCreateRequestDto>;
        links = links.map((item) => (item.publicId === publicId ? { ...item, ...body } : item));
        return HttpResponse.json(links.find((item) => item.publicId === publicId));
    }),
    http.delete(`${linksUrl}/:publicId`, ({ params }) => {
        const publicId = params["publicId"] as string;
        links = links.filter((item) => item.publicId !== publicId);
        return new HttpResponse(null, { status: 204 });
    }),
];

export const handlers = [
    ...mediaHandlers,
    ...linkHandlers,
    ...guildHandlers,
    ...guildApplicationHandlers,
    ...gamePostHandlers,
    createGatewayListHandler({
        apiUrl: environment.apiUrl,
        microservice: "worldofwarcraft",
        resource: "Classes",
        data: mockClasses,
    }),
    http.post(gatewayUrl(environment.apiUrl, "worldofwarcraft", "HomeFeed", "actions", "Get"), () =>
        HttpResponse.json(mockHomeFeed),
    ),
    http.post(gatewayUrl(environment.apiUrl, "worldofwarcraft", "LfgAds", "actions", "ListRecent"), async ({ request }) => {
        const { kind } = (await request.json()) as { kind?: string };
        return HttpResponse.json(kind === "recruit" ? mockRecruitmentMessages : mockLfgMessages);
    }),
    http.post(gatewayUrl(environment.apiUrl, "worldofwarcraft", "LfgAds", "actions", "Search"), async ({ request }) => {
        const { kind, query } = (await request.json()) as { kind?: string; query?: string };
        const source = kind === "recruit" ? mockRecruitmentMessages : mockLfgMessages;
        const needle = query?.trim().toLowerCase();
        const items = needle ? source.filter((ad) => ad.body.toLowerCase().includes(needle)) : source;
        return HttpResponse.json({ items, hasMore: false });
    }),
    http.post(gatewayUrl(environment.apiUrl, "worldofwarcraft", "LfgAds", "actions", "Create"), async ({ request }) => {
        const body = (await request.json()) as { body: string; guildPublicId?: string };
        const template = body.guildPublicId ? mockRecruitmentMessages[0] : mockLfgMessages[0];
        return HttpResponse.json({
            ...template,
            publicId: crypto.randomUUID(),
            body: body.body,
            creationDate: new Date().toISOString(),
        });
    }),
    http.get(`${environment.apiUrl}/platform/games`, () =>
        HttpResponse.json([
            { id: 1, title: "World Of Warcraft", urlValue: "/world-of-warcraft", picture: "world-of-warcraft" },
        ]),
    ),
    http.post(gatewayUrl(environment.apiUrl, "worldofwarcraft", "Players", "actions", "Resolve"), () =>
        HttpResponse.json({
            playerPublicId: hasPlayerSheet ? mockPlayerSheet.publicId : null,
            hasSheet: hasPlayerSheet,
        }),
    ),
    http.post(gatewayUrl(environment.apiUrl, "worldofwarcraft", "Players", "actions", "Load"), () => {
        hasPlayerSheet = true;
        return HttpResponse.json(mockPlayerSheet);
    }),
    http.get(gatewayUrl(environment.apiUrl, "worldofwarcraft", "Players", mockPlayerSheet.publicId), () =>
        HttpResponse.json({ ...mockPlayerSheet, characterCount: characters.length, layoutJson }),
    ),
    http.put(`${playersUrl}/:publicId`, async ({ request }) => {
        const body = (await request.json()) as PlayerUpdateRequestDto;
        layoutJson = body.layoutJson ?? layoutJson;
        return HttpResponse.json({ ...mockPlayerSheet, characterCount: characters.length, layoutJson });
    }),
    http.post(gatewayUrl(environment.apiUrl, "worldofwarcraft", "Characters", "actions", "List"), () =>
        HttpResponse.json(characters),
    ),
    http.post(gatewayUrl(environment.apiUrl, "worldofwarcraft", "Characters", "actions", "Options"), () =>
        HttpResponse.json(mockCharacterOptions),
    ),
    http.post(gatewayUrl(environment.apiUrl, "worldofwarcraft", "Characters", "actions", "Create"), async ({ request }) => {
        const body = (await request.json()) as CharacterCreateRequestDto;
        const created = buildMockCharacter(body, crypto.randomUUID());
        characters = created.main ? characters.map((item) => ({ ...item, main: false })) : characters;
        characters = [...characters, created];
        return HttpResponse.json(created);
    }),
    http.put(`${charactersUrl}/:publicId`, async ({ request, params }) => {
        const publicId = params["publicId"] as string;
        const body = (await request.json()) as CharacterCreateRequestDto;
        const updated = { ...buildMockCharacter(body, publicId) };
        characters = characters.map((item) => (item.publicId === publicId ? updated : item));
        if (updated.main) {
            characters = characters.map((item) => (item.publicId === publicId ? item : { ...item, main: false }));
        }
        return HttpResponse.json(updated);
    }),
    http.delete(`${charactersUrl}/:publicId`, ({ params }) => {
        const publicId = params["publicId"] as string;
        characters = characters.filter((item) => item.publicId !== publicId);
        return new HttpResponse(null, { status: 204 });
    }),
    http.post(`${environment.apiUrl.replace(/\/+$/, "")}/platform/users/actions/Touch`, () =>
        HttpResponse.json({
            id: 1,
            publicId: PLATFORM_USER_PUBLIC_ID,
            nickname: "Aelindra",
            discriminator: "0042",
            avatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=${PLATFORM_USER_PUBLIC_ID}`,
            activeMute: null,
        }),
    ),
    http.get(`${environment.apiUrl.replace(/\/+$/, "")}/platform/users/:publicId`, ({ params }) => {
        const publicId = params["publicId"] as string;
        return HttpResponse.json({
            publicId,
            avatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=${publicId}`,
        });
    }),
];
