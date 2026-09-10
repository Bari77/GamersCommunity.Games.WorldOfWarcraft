import { computed, inject, Injectable, resource, signal } from "@angular/core";
import { Router } from "@angular/router";
import { WOW_GAME_ID, WOW_GAME_URL } from "@core/constants/game.constants";
import { PlatformSession, PlatformSessionService } from "@core/services/platform-session.service";
import { PlayerResolveResult } from "@features/players/models/player.model";
import { PlayersService } from "@features/players/services/players.service";
import { PromiseUtils } from "@shared/utils/promise.utils";
import { ResourceUtils } from "@shared/utils/resource.utils";
import { firstValueFrom } from "rxjs";

const PROMPT_DISMISSED_KEY = `gc.game-sheet-prompt.dismissed.${WOW_GAME_ID}`;
const NO_SHEET = new PlayerResolveResult(null, false);

/**
 * Single source of truth for "who is visiting and does he own a sheet in this game".
 *
 * Browsing the game stays anonymous: nothing here writes to the back. The sheet only ever comes
 * into existence through {@link createSheet}, on an explicit user action.
 */
@Injectable({ providedIn: "root" })
export class GameMembershipStore {
    public readonly session = computed(() => this.sessionResource.value());
    public readonly isAuthenticated = computed(() => this.session() !== null);

    public readonly playerPublicId = computed(
        () => this.createdPlayerPublicId() ?? this.resolutionResource.value().playerPublicId,
    );
    public readonly hasSheet = computed(
        () => this.createdPlayerPublicId() !== null || this.resolutionResource.value().hasSheet,
    );

    /** The lookup is only awaited for a logged-in visitor: an anonymous one has nothing to resolve. */
    public readonly loading = computed(
        () =>
            ResourceUtils.isPending(this.sessionResource) ||
            (this.isAuthenticated() && ResourceUtils.isPending(this.resolutionResource)),
    );

    /** The lookup answered for the current session, so `hasSheet()` can be trusted. */
    public readonly resolved = computed(() => this.isAuthenticated() && !this.loading());

    /** Logged in, lookup done, still no sheet: the state the create wall and the popup target. */
    public readonly needsSheet = computed(() => this.resolved() && !this.hasSheet());

    public readonly creating = signal(false);

    public readonly promptDismissed = computed(() => this.dismissed());
    public readonly shouldPromptSheetCreation = computed(() => this.needsSheet() && !this.promptDismissed());

    private readonly platformSession = inject(PlatformSessionService);
    private readonly players = inject(PlayersService);
    private readonly router = inject(Router);

    /** A failed touch just means nobody is logged in, which is a supported way to browse. */
    private readonly sessionResource = resource({
        loader: () => firstValueFrom(this.platformSession.touch()).catch(() => null),
        defaultValue: null as PlatformSession | null,
    });

    /** Read-only lookup, unlike `players.load()` which upserts the sheet. */
    private readonly resolutionResource = resource({
        params: () => this.session()?.publicId,
        loader: ({ params }) => firstValueFrom(this.players.resolve(params)).catch(() => NO_SHEET),
        defaultValue: NO_SHEET,
    });

    private readonly createdPlayerPublicId = signal<string | null>(null);
    private readonly dismissed = signal(this.readDismissed());

    /** Lets imperative callers read the signals above once they hold their final value. */
    public whenResolved(): Promise<void> {
        return PromiseUtils.waitUntilFalse(() => this.loading());
    }

    /**
     * Creates the sheet for the current session and returns its public id, or null on failure.
     *
     * This is the only path that may call `load()`, and it must stay behind an explicit user
     * action.
     */
    public async createSheet(): Promise<string | null> {
        const session = this.session();
        if (!session || this.creating()) {
            return null;
        }

        const existing = this.playerPublicId();
        if (existing) {
            return existing;
        }

        this.creating.set(true);
        try {
            const sheet = await firstValueFrom(
                this.players.load({
                    platformUserId: session.id,
                    platformUserPublicId: session.publicId,
                }),
            );
            this.createdPlayerPublicId.set(sheet.publicId);
            return sheet.publicId;
        } catch {
            return null;
        } finally {
            this.creating.set(false);
        }
    }

    /** Creation always lands on the sheet, so the visitor is invited to fill it in right away. */
    public async createSheetAndOpen(): Promise<void> {
        const playerPublicId = await this.createSheet();
        if (playerPublicId) {
            await this.router.navigate([`${WOW_GAME_URL}/players`, playerPublicId]);
        }
    }

    public dismissPrompt(): void {
        this.dismissed.set(true);
        this.writeDismissed();
    }

    /** Storage throws in private browsing or when it is disabled; the prompt then keeps asking. */
    private readDismissed(): boolean {
        try {
            return localStorage.getItem(PROMPT_DISMISSED_KEY) === "true";
        } catch {
            return false;
        }
    }

    private writeDismissed(): void {
        try {
            localStorage.setItem(PROMPT_DISMISSED_KEY, "true");
        } catch {
            // The refusal is lost for the next visit, nothing else breaks.
        }
    }
}
