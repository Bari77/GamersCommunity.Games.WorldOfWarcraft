import { computed, inject, Injectable, signal } from "@angular/core";
import { GamePostCreateRequestDto } from "@features/guilds/dto/game-post.dto";
import { GamePost } from "@features/guilds/models/game-post.model";
import { GamePostsService } from "@features/guilds/services/game-posts.service";
import { firstValueFrom } from "rxjs";

const PAGE_SIZE = 20;

/** What the publish and edit forms both carry. */
export interface GamePostDraft {
    body: string;
    mediaUrl: string | null;
    visibility: string;
}

@Injectable()
export class GuildWallStore {
    public readonly posts = signal<GamePost[]>([]);
    public readonly loading = signal(true);
    public readonly loadingMore = signal(false);
    public readonly hasMore = signal(false);

    public readonly pending = signal<GamePost[]>([]);
    public readonly loadingPending = signal(false);

    public readonly posting = signal(false);
    public readonly errorCode = signal<string | null>(null);

    public readonly pendingCount = computed(() => this.pending().length);

    private readonly gamePosts = inject(GamePostsService);
    private guildPublicId: string | null = null;

    public async load(guildPublicId: string, withPending: boolean): Promise<void> {
        this.guildPublicId = guildPublicId;
        this.loading.set(true);
        try {
            const page = await firstValueFrom(this.gamePosts.listGuildWall({ guildPublicId, take: PAGE_SIZE }));
            this.posts.set(page.items);
            this.hasMore.set(page.hasMore);
        } finally {
            this.loading.set(false);
        }

        if (withPending) {
            await this.loadPending();
        }
    }

    public async loadPending(): Promise<void> {
        const guildPublicId = this.guildPublicId;
        if (!guildPublicId) {
            return;
        }

        this.loadingPending.set(true);
        try {
            const page = await firstValueFrom(this.gamePosts.listPending({ guildPublicId, take: PAGE_SIZE }));
            this.pending.set(page.items);
        } catch {
            this.pending.set([]);
        } finally {
            this.loadingPending.set(false);
        }
    }

    public async loadMore(): Promise<void> {
        const guildPublicId = this.guildPublicId;
        const current = this.posts();
        const last = current.at(-1);
        if (!guildPublicId || !last || !this.hasMore() || this.loadingMore()) {
            return;
        }

        this.loadingMore.set(true);
        try {
            const page = await firstValueFrom(
                this.gamePosts.listGuildWall({
                    guildPublicId,
                    beforeCreationDate: last.creationDate.toISOString(),
                    beforePublicId: last.publicId,
                    take: PAGE_SIZE,
                }),
            );
            const known = new Set(current.map((post) => post.publicId));
            this.posts.set([...current, ...page.items.filter((post) => !known.has(post.publicId))]);
            this.hasMore.set(page.hasMore);
        } finally {
            this.loadingMore.set(false);
        }
    }

    /**
     * Returns the created post so the caller can tell a published message from one that landed in
     * the review queue, the two outcomes of the same button depending on the author's rank.
     */
    public async publish(draft: GamePostDraft): Promise<GamePost | null> {
        const guildPublicId = this.guildPublicId;
        if (!guildPublicId || this.posting()) {
            return null;
        }

        const request: GamePostCreateRequestDto = {
            guildPublicId,
            body: draft.body,
            visibility: draft.visibility,
            ...(draft.mediaUrl ? { mediaUrl: draft.mediaUrl, mediaKind: "image" } : {}),
        };

        this.posting.set(true);
        this.errorCode.set(null);
        try {
            const post = await firstValueFrom(this.gamePosts.create(request));
            if (post.isPending()) {
                this.pending.update((current) => [post, ...current]);
            } else {
                this.posts.update((current) => [post, ...current]);
            }
            return post;
        } catch (err: unknown) {
            this.errorCode.set((err as { error?: { Code?: string } })?.error?.Code ?? "UNKNOWN");
            return null;
        } finally {
            this.posting.set(false);
        }
    }

    /**
     * Editing an approved post sends a member's version back to the review queue, so the wall drops
     * it and the officers' list picks it up. Officers keep theirs published.
     */
    public async edit(publicId: string, draft: GamePostDraft): Promise<GamePost | null> {
        if (this.posting()) {
            return null;
        }

        this.posting.set(true);
        this.errorCode.set(null);
        try {
            const post = await firstValueFrom(
                this.gamePosts.update({
                    publicId,
                    body: draft.body,
                    visibility: draft.visibility,
                    mediaUrl: draft.mediaUrl,
                    mediaKind: draft.mediaUrl ? "image" : null,
                }),
            );

            const replace = (current: GamePost[]) => current.map((item) => (item.publicId === publicId ? post : item));
            const drop = (current: GamePost[]) => current.filter((item) => item.publicId !== publicId);

            if (post.isPending()) {
                this.posts.update(drop);
                this.pending.update((current) =>
                    current.some((item) => item.publicId === publicId) ? replace(current) : [post, ...current],
                );
            } else {
                this.pending.update(drop);
                this.posts.update((current) =>
                    current.some((item) => item.publicId === publicId) ? replace(current) : [post, ...current],
                );
            }

            return post;
        } catch (err: unknown) {
            this.errorCode.set((err as { error?: { Code?: string } })?.error?.Code ?? "UNKNOWN");
            return null;
        } finally {
            this.posting.set(false);
        }
    }

    public async moderate(publicId: string, approve: boolean): Promise<boolean> {
        this.errorCode.set(null);
        try {
            const post = await firstValueFrom(this.gamePosts.moderate({ publicId, approve }));
            this.pending.update((current) => current.filter((item) => item.publicId !== publicId));
            if (approve) {
                this.posts.update((current) => [post, ...current]);
            }
            return true;
        } catch (err: unknown) {
            this.errorCode.set((err as { error?: { Code?: string } })?.error?.Code ?? "UNKNOWN");
            return false;
        }
    }

    public async remove(publicId: string): Promise<boolean> {
        this.errorCode.set(null);
        try {
            await firstValueFrom(this.gamePosts.remove({ publicId }));
            this.posts.update((current) => current.filter((item) => item.publicId !== publicId));
            this.pending.update((current) => current.filter((item) => item.publicId !== publicId));
            return true;
        } catch (err: unknown) {
            this.errorCode.set((err as { error?: { Code?: string } })?.error?.Code ?? "UNKNOWN");
            return false;
        }
    }
}
