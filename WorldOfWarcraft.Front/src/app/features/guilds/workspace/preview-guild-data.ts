import { GcGalleryItem, GcLink } from "@bari77/gc-widgets";
import { Character } from "@features/characters/models/character.model";
import { GuildMember } from "@features/guilds/models/guild.model";
import { WORKSPACE_PREVIEW_GUILD } from "@features/guilds/workspace/preview-guild";
import { mockCharacters } from "../../../../mocks/catalog/characters";
import { mockGuildLinks } from "../../../../mocks/catalog/guild-links";
import {
    GUILD_PUBLIC_ID,
    mockGuildApplications,
    mockGuildWallPosts,
    mockPendingPosts,
} from "../../../../mocks/catalog/orgs";
import { WorkspacePreviewApplication } from "./workspace-preview-application";

export const WORKSPACE_PREVIEW_GUILD_MEMBERS: GuildMember[] = WORKSPACE_PREVIEW_GUILD.members;

/** Characters a visitor could pick when applying to the guild (guildless mains from the cast). */
export const WORKSPACE_PREVIEW_APPLY_CANDIDATES: Character[] = mockCharacters
    .filter((character) => !character.guildPublicId && character.main)
    .slice(0, 2)
    .map((dto) => Character.fromDto(dto));

export const WORKSPACE_PREVIEW_GUILD_LINKS: GcLink[] = mockGuildLinks
    .filter((link) => link.guildPublicId === GUILD_PUBLIC_ID)
    .map((link) => ({ url: link.url, label: link.label ?? link.url }));

export const WORKSPACE_PREVIEW_GUILD_PHOTOS: GcGalleryItem[] = [
    { url: "https://picsum.photos/seed/gc-guild-photo-1/960/720", title: "First heroic clear" },
    { url: "https://picsum.photos/seed/gc-guild-photo-2/960/720", title: "Guild meeting" },
    { url: "https://picsum.photos/seed/gc-guild-photo-3/960/720", title: "Team photo" },
    { url: "https://picsum.photos/seed/gc-guild-photo-4/960/720", title: "Raid comp" },
];

export const WORKSPACE_PREVIEW_GUILD_VIDEOS: GcGalleryItem[] = [
    { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", title: "Recruitment trailer" },
    { url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", title: "Boss kill POV" },
];

export interface WorkspacePreviewWallPost {
    author: string;
    date: Date;
    body: string;
    audience?: string;
}

export const WORKSPACE_PREVIEW_PENDING_POSTS: WorkspacePreviewWallPost[] = mockPendingPosts
    .filter((post) => post.guildPublicId === GUILD_PUBLIC_ID)
    .map((post) => ({
        author: `${post.authorNickname}#${post.authorDiscriminator}`,
        date: new Date(post.creationDate),
        body: post.body,
        audience: post.visibility === "member" ? "Members" : undefined,
    }));

export const WORKSPACE_PREVIEW_WALL_POSTS: WorkspacePreviewWallPost[] = mockGuildWallPosts
    .filter((post) => post.guildPublicId === GUILD_PUBLIC_ID)
    .map((post) => ({
        author: `${post.authorNickname}#${post.authorDiscriminator}`,
        date: new Date(post.creationDate),
        body: post.body,
        audience: post.visibility === "member" ? "Members" : undefined,
    }));

export const WORKSPACE_PREVIEW_APPLICATIONS: WorkspacePreviewApplication[] = mockGuildApplications.map(
    (application) => ({
        character: application.characterPseudo,
        spec: `${application.characterClassName} · ${application.characterRaceName}`,
        level: application.characterLevel,
        server: application.characterServerName,
        player: `${application.nickname}#${application.discriminator}`,
        message: application.message,
        date: new Date(application.creationDate),
    }),
);

export const WORKSPACE_PREVIEW_GUILD_ID = GUILD_PUBLIC_ID;
