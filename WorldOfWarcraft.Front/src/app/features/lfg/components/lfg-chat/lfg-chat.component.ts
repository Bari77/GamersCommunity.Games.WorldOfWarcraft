import { Component, computed, inject, input, OnDestroy, OnInit } from "@angular/core";
import {
    LfgChatComponent as GcLfgChatComponent,
    LfgChatLeadingDirective,
    LfgChatNeedsSheetDirective,
    type LfgChatComposerState,
    type LfgChatLabels,
    type LfgChatMessage as GcLfgChatMessage,
    type LfgChatPosterOption,
} from "@bari77/gc-widgets";
import { PlatformAvatarStore } from "@core/stores/platform-avatar.store";
import { LFG_KIND_RECRUITMENT, LfgKind, LfgMessage } from "@features/lfg/models/lfg-message.model";
import { LfgChatStore } from "@features/lfg/stores/lfg-chat.store";
import { LfgRealtimeService } from "@features/lfg/services/lfg-realtime.service";
import { CreateSheetWallComponent } from "@shared/components/create-sheet-wall/create-sheet-wall.component";
import { GuildCrestComponent } from "@shared/components/guild-crest/guild-crest.component";

@Component({
    standalone: true,
    selector: "wow-lfg-chat",
    imports: [
        GcLfgChatComponent,
        LfgChatLeadingDirective,
        LfgChatNeedsSheetDirective,
        CreateSheetWallComponent,
        GuildCrestComponent,
    ],
    providers: [LfgChatStore],
    templateUrl: "./lfg-chat.component.html",
})
export class LfgChatComponent implements OnInit, OnDestroy {
    public readonly kind = input<LfgKind>("lfg");

    public readonly store = inject(LfgChatStore);
    public readonly realtime = inject(LfgRealtimeService);
    public readonly avatars = inject(PlatformAvatarStore);

    protected readonly sheetWallMessage = $localize`:@@wow.sheet.wall.lfgMessage:Create your player profile to post in this chat.`;

    protected readonly labels: LfgChatLabels = {
        live: $localize`:@@wow.home.lfg.live:Live`,
        empty: $localize`:@@wow.home.lfg.empty:No messages yet. Say hello!`,
        loadingOlder: $localize`:@@wow.home.lfg.loadingOlder:Loading older messages…`,
        newMessages: $localize`:@@wow.home.lfg.newMessages:New messages`,
        composePlaceholder: $localize`:@@wow.home.lfg.bodyPlaceholder:Type a message…`,
        posterPickerPlaceholder: $localize`:@@wow.home.recruit.guildPicker:Post as…`,
        muted: $localize`:@@wow.home.lfg.muted:You are muted and cannot post recruitment messages.`,
        noPoster: $localize`:@@wow.home.recruit.noGuild:Only guild officers can post here.`,
        pickPoster: $localize`:@@wow.home.recruit.pickGuild:Pick the guild you are posting for to enable the composer.`,
        cooldown: $localize`:@@wow.home.lfg.cooldown:Please wait`,
        cooldownHint: $localize`:@@wow.home.lfg.cooldownHint: before posting again.`,
        login: $localize`:@@wow.home.lfg.login:Log in`,
        loginHint: $localize`:@@wow.home.lfg.loginHint: to join the global LFG chat.`,
        loginHref: "/users/login",
    };

    protected readonly title = computed(() =>
        this.isRecruitment()
            ? $localize`:@@wow.home.recruit:Guild recruitment`
            : $localize`:@@wow.home.lfg:Looking for group`,
    );

    protected readonly viewMessages = computed((): GcLfgChatMessage[] => {
        const sessionId = this.store.session()?.publicId;
        const playerId = this.store.playerPublicId();
        return this.store.messages().map((message) => this.toViewMessage(message, sessionId, playerId));
    });

    protected readonly posterOptions = computed((): LfgChatPosterOption[] =>
        this.store.postableGuilds().map((guild) => ({
            publicId: guild.publicId,
            handleLabel: guild.handleLabel(),
        })),
    );

    protected readonly composerState = computed((): LfgChatComposerState => {
        if (this.store.loading()) {
            return "hidden";
        }
        if (this.store.isMuted()) {
            return "muted";
        }
        if (this.store.hasNoPostableGuild()) {
            return "noPoster";
        }
        if (this.store.canPost() && this.store.cooldownSeconds() > 0) {
            return "cooldown";
        }
        if (this.store.canSend()) {
            return "ready";
        }
        if (this.store.canPost() && this.isRecruitment()) {
            return "pickPoster";
        }
        if (this.store.needsSheet()) {
            return "needsSheet";
        }
        if (!this.store.canPost()) {
            return "login";
        }
        return "hidden";
    });

    public async ngOnInit(): Promise<void> {
        await this.store.init(this.kind());
    }

    public ngOnDestroy(): void {
        this.store.destroy();
    }

    protected isRecruitment(): boolean {
        return this.kind() === LFG_KIND_RECRUITMENT;
    }

    protected asMessage(context: unknown): LfgMessage {
        return context as LfgMessage;
    }

    protected onSend(body: string): void {
        void this.store.send(body);
    }

    protected onRequestOlder(): void {
        void this.store.loadOlder();
    }

    private messageAvatar(message: LfgMessage): string {
        const session = this.store.session();
        return this.avatars.urlFor(message.platformUserPublicId, {
            sessionPublicId: session?.publicId,
            sessionAvatarUrl: session?.avatarUrl,
            fallbackUrl: message.senderAvatarUrl,
        });
    }

    private toViewMessage(
        message: LfgMessage,
        sessionId: string | null | undefined,
        playerId: string | null | undefined,
    ): GcLfgChatMessage {
        let senderLink: unknown[] | null = null;
        if (message.isGuildAd() && message.guildPublicId) {
            senderLink = ["/world-of-warcraft/guilds", message.guildPublicId];
        } else if (message.playerPublicId) {
            senderLink = ["/world-of-warcraft/players", message.playerPublicId];
        }

        return {
            publicId: message.publicId,
            body: message.body,
            creationDate: message.creationDate,
            handleLabel: message.handleLabel(),
            initial: message.initial(),
            isMine: message.isMine(sessionId, playerId),
            avatarUrl: message.isGuildAd() ? null : this.messageAvatar(message) || null,
            senderLink,
            context: message,
        };
    }
}
