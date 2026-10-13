import { GcGalleryItem, GcLink } from "@bari77/gc-widgets";
import { Character } from "@features/characters/models/character.model";
import { mockCharacters, PLAYER_PUBLIC_ID } from "../../../../mocks/catalog/characters";
import { mockPlayerLinks } from "../../../../mocks/catalog/links";
import { mockPlayerPictures, mockPlayerStreams, mockPlayerVideos } from "../../../../mocks/catalog/media";

function mediaToGallery(items: { url: string; caption?: string | null }[]): GcGalleryItem[] {
    return items.map((item) => ({ url: item.url, title: item.caption ?? undefined }));
}

const sessionCharacters = mockCharacters.filter((item) => item.playerPublicId === PLAYER_PUBLIC_ID);
const sessionPictures = mockPlayerPictures.filter((item) => item.playerPublicId === PLAYER_PUBLIC_ID);
const sessionVideos = mockPlayerVideos.filter((item) => item.playerPublicId === PLAYER_PUBLIC_ID);
const sessionStreams = mockPlayerStreams.filter((item) => item.playerPublicId === PLAYER_PUBLIC_ID);

export const WORKSPACE_PREVIEW_CHARACTERS: Character[] = sessionCharacters.map((dto) => Character.fromDto(dto));

export const WORKSPACE_PREVIEW_LINKS: GcLink[] = mockPlayerLinks
    .filter((link) => link.playerPublicId === PLAYER_PUBLIC_ID)
    .map((link) => ({ url: link.url, label: link.label ?? link.url }));

export const WORKSPACE_PREVIEW_PHOTOS: GcGalleryItem[] = mediaToGallery(sessionPictures);
export const WORKSPACE_PREVIEW_VIDEOS: GcGalleryItem[] = mediaToGallery(sessionVideos);
export const WORKSPACE_PREVIEW_STREAMS: GcGalleryItem[] = mediaToGallery(sessionStreams);
