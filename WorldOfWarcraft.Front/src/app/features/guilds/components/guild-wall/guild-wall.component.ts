import { DatePipe } from "@angular/common";
import { Component, inject, input, OnInit, output, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { SkeletonComponent, SkeletonTextComponent } from "@bari77/gc-ui";
import { GamePost } from "@features/guilds/models/game-post.model";
import { GuildWallStore } from "@features/guilds/stores/guild-wall.store";
import { NbButtonModule, NbCardModule, NbInputModule } from "@nebular/theme";

@Component({
    standalone: true,
    selector: "wow-guild-wall",
    imports: [
        DatePipe,
        FormsModule,
        RouterLink,
        NbButtonModule,
        NbCardModule,
        NbInputModule,
        SkeletonComponent,
        SkeletonTextComponent,
    ],
    providers: [GuildWallStore],
    templateUrl: "./guild-wall.component.html",
    styleUrl: "./guild-wall.component.scss",
})
export class GuildWallComponent implements OnInit {
    public readonly guildPublicId = input.required<string>();
    public readonly canPublish = input(false);
    public readonly canModerate = input(false);
    public readonly playerPublicId = input<string | null>(null);

    /** Fired after a moderation decision so the sheet can refresh its pending counter. */
    public readonly moderated = output<void>();

    protected readonly store = inject(GuildWallStore);

    protected readonly bodyPlaceholder = $localize`:@@wow.guild.wall.bodyPlaceholder:Share something with the guild…`;
    protected readonly mediaPlaceholder = $localize`:@@wow.guild.wall.mediaPlaceholder:Image link (optional)`;

    protected readonly postPlaceholders = [0, 1, 2];

    protected readonly body = signal("");
    protected readonly mediaUrl = signal("");

    /** Set after a member's post landed in the queue, since nothing appears on the wall. */
    protected readonly queuedNotice = signal(false);

    public async ngOnInit(): Promise<void> {
        await this.store.load(this.guildPublicId(), this.canModerate());
    }

    protected async publish(): Promise<void> {
        const body = this.body().trim();
        if (!body || this.store.posting()) {
            return;
        }

        const post = await this.store.publish(body, this.mediaUrl().trim() || null);
        if (!post) {
            return;
        }

        this.body.set("");
        this.mediaUrl.set("");
        this.queuedNotice.set(post.isPending());
    }

    protected async moderate(post: GamePost, approve: boolean): Promise<void> {
        if (await this.store.moderate(post.publicId, approve)) {
            this.moderated.emit();
        }
    }

    protected async remove(post: GamePost): Promise<void> {
        if (await this.store.remove(post.publicId)) {
            this.moderated.emit();
        }
    }

    protected canDelete(post: GamePost): boolean {
        return this.canModerate() || post.isMine(this.playerPublicId());
    }
}
