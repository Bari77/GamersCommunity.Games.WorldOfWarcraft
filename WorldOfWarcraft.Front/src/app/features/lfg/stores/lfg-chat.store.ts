import { computed, Injectable, inject, signal } from "@angular/core";
import { PlatformSession, PlatformSessionService } from "@core/services/platform-session.service";
import { CreateLfgMessageRequestDto } from "@features/lfg/dto/lfg-message.dto";
import { LFG_KIND_RECRUITMENT, LfgKind, LfgMessage, PostableGuild } from "@features/lfg/models/lfg-message.model";
import { PlatformAvatarStore } from "@core/stores/platform-avatar.store";
import { GuildsService, LfgChatService } from "@features/lfg/services/lfg-chat.service";
import { LfgRealtimeService } from "@features/lfg/services/lfg-realtime.service";
import { PlayersService } from "@features/players/services/players.service";
import { firstValueFrom } from "rxjs";

const PAGE_SIZE = 50;
const POST_COOLDOWN_MS = 3 * 60 * 1000;

@Injectable()
export class LfgChatStore {
    public readonly messages = signal<LfgMessage[]>([]);
    public readonly loading = signal(true);
    public readonly loadingOlder = signal(false);
    public readonly hasMore = signal(true);
    public readonly posting = signal(false);
    public readonly canPost = signal(false);
    public readonly isMuted = signal(false);
    public readonly session = signal<PlatformSession | null>(null);
    public readonly playerPublicId = signal<string | null>(null);
    public readonly cooldownUntil = signal(0);
    public readonly cooldownSeconds = signal(0);

    /** Guilds the player may post for. Only loaded on the recruitment thread. */
    public readonly postableGuilds = signal<PostableGuild[]>([]);

    /** Public id of the guild the next ad is published for. Always null on the player thread. */
    public readonly postingAs = signal<string | null>(null);

    public readonly canSend = computed(
        () =>
            this.canPost() &&
            !this.isMuted() &&
            !this.posting() &&
            // The recruitment thread stays disabled until the emitting guild is picked.
            (this.kind !== LFG_KIND_RECRUITMENT || this.postingAs() !== null) &&
            Date.now() >= this.cooldownUntil(),
    );

    /** No guild grants the officer rank, so the recruitment composer can never be unlocked. */
    public readonly hasNoPostableGuild = computed(
        () => this.kind === LFG_KIND_RECRUITMENT && this.canPost() && this.postableGuilds().length === 0,
    );

    private kind: LfgKind = "lfg";

    private readonly chat = inject(LfgChatService);
    private readonly guilds = inject(GuildsService);
    private readonly platformSession = inject(PlatformSessionService);
    private readonly players = inject(PlayersService);
    private readonly avatars = inject(PlatformAvatarStore);
    private readonly realtime = inject(LfgRealtimeService);
    private cooldownTimer: ReturnType<typeof setInterval> | null = null;

    public async init(kind: LfgKind): Promise<void> {
        this.kind = kind;
        this.loading.set(true);
        try {
            await this.loadSession();
            const messages = await firstValueFrom(this.chat.listRecent(kind));
            this.messages.set(messages);
            this.hasMore.set(messages.length >= PAGE_SIZE);
            this.syncCooldownFromMessages(messages);
            await this.avatars.prefetchPublicIds(
                messages.filter((message) => message.hasPlatformProfile()).map((message) => message.platformUserPublicId),
            );
            // Both threads share one hub, so each store keeps only what belongs to its kind.
            await this.realtime.connect((message) => {
                if (message.kind === this.kind) {
                    this.appendMessage(message);
                }
            });
        } finally {
            this.loading.set(false);
        }
    }

    public async send(body: string): Promise<void> {
        const trimmed = body.trim();
        const session = this.session();
        if (!trimmed || !this.canSend() || !session) {
            return;
        }

        this.posting.set(true);
        try {
            const guildPublicId = this.postingAs();
            const payload: CreateLfgMessageRequestDto = {
                body: trimmed,
                platformUserId: session.id,
                platformUserPublicId: session.publicId,
                ...(guildPublicId ? { guildPublicId } : {}),
            };
            const message = await firstValueFrom(this.chat.send(payload));
            this.appendMessage(message);
            this.cooldownUntil.set(Date.now() + POST_COOLDOWN_MS);
            this.startCooldownTicker();
        } catch (err: unknown) {
            const code = (err as { error?: { Code?: string } })?.error?.Code;
            if (code === "COOLDOWN") {
                this.cooldownUntil.set(Date.now() + POST_COOLDOWN_MS);
                this.startCooldownTicker();
            }
            throw err;
        } finally {
            this.posting.set(false);
        }
    }

    public async loadOlder(): Promise<boolean> {
        const current = this.messages();
        if (!this.hasMore() || this.loadingOlder() || current.length === 0) {
            return false;
        }

        const oldest = current[0];
        this.loadingOlder.set(true);
        try {
            const page = await firstValueFrom(this.chat.listBefore(this.kind, oldest));
            if (page.length === 0) {
                this.hasMore.set(false);
                return false;
            }

            const known = new Set(current.map((item) => item.publicId));
            const older = page.filter((item) => !known.has(item.publicId));
            this.messages.set([...older, ...current]);
            this.hasMore.set(page.length >= PAGE_SIZE);
            await this.avatars.prefetchPublicIds(
                older.filter((message) => message.hasPlatformProfile()).map((message) => message.platformUserPublicId),
            );
            return older.length > 0;
        } finally {
            this.loadingOlder.set(false);
        }
    }

    public destroy(): void {
        this.stopCooldownTicker();
        void this.realtime.disconnect();
    }

    private async loadSession(): Promise<void> {
        try {
            const session = await firstValueFrom(this.platformSession.touch());
            this.session.set(session);
            this.canPost.set(true);
            this.isMuted.set(session.activeMute !== null);
            if (session.avatarUrl && session.publicId) {
                this.avatars.avatars.update((current) => ({
                    ...current,
                    [session.publicId]: session.avatarUrl,
                }));
            }
            const sheet = await firstValueFrom(
                this.players.load({
                    platformUserId: session.id,
                    platformUserPublicId: session.publicId,
                }),
            );
            this.playerPublicId.set(sheet.publicId);
            if (this.kind === LFG_KIND_RECRUITMENT) {
                await this.loadPostableGuilds();
            }
        } catch {
            this.session.set(null);
            this.playerPublicId.set(null);
            this.canPost.set(false);
            this.isMuted.set(false);
            this.postableGuilds.set([]);
            this.postingAs.set(null);
        }
    }

    /**
     * A single guild is pre-selected so nothing is asked of a player who only leads one. With
     * several, the composer waits for an explicit choice to avoid posting for the wrong guild.
     */
    private async loadPostableGuilds(): Promise<void> {
        const guilds = await firstValueFrom(this.guilds.listPostable());
        this.postableGuilds.set(guilds);
        this.postingAs.set(guilds.length === 1 ? guilds[0].publicId : null);
    }

    public selectGuild(guildPublicId: string): void {
        this.postingAs.set(guildPublicId);
    }

    private appendMessage(message: LfgMessage): void {
        const current = this.messages();
        if (current.some((item) => item.publicId === message.publicId)) {
            return;
        }
        this.messages.set([...current, message]);
        if (message.isMine(this.session()?.publicId, this.playerPublicId())) {
            this.syncCooldownFromMessages([...current, message]);
        }
        if (message.senderAvatarUrl && message.hasPlatformProfile()) {
            this.avatars.avatars.update((current) => ({
                ...current,
                [message.platformUserPublicId]: message.senderAvatarUrl,
            }));
        } else if (message.hasPlatformProfile()) {
            void this.avatars.ensure(message.platformUserPublicId);
        }
    }

    private syncCooldownFromMessages(messages: LfgMessage[]): void {
        const playerPublicId = this.playerPublicId();
        if (!playerPublicId) {
            return;
        }

        const lastMine = messages
            .filter((message) => message.playerPublicId === playerPublicId)
            .at(-1);
        if (!lastMine) {
            return;
        }

        const until = lastMine.creationDate.getTime() + POST_COOLDOWN_MS;
        if (until > Date.now()) {
            this.cooldownUntil.set(until);
            this.startCooldownTicker();
        }
    }

    private startCooldownTicker(): void {
        this.tickCooldown();
        if (this.cooldownTimer) {
            return;
        }
        this.cooldownTimer = setInterval(() => this.tickCooldown(), 1000);
    }

    private tickCooldown(): void {
        const remaining = Math.max(0, Math.ceil((this.cooldownUntil() - Date.now()) / 1000));
        this.cooldownSeconds.set(remaining);
        if (remaining === 0) {
            this.stopCooldownTicker();
        }
    }

    private stopCooldownTicker(): void {
        if (!this.cooldownTimer) {
            return;
        }
        clearInterval(this.cooldownTimer);
        this.cooldownTimer = null;
    }
}
