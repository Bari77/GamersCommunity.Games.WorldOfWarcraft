import { DatePipe } from "@angular/common";
import { Component, inject, input, OnInit, output, signal, viewChild } from "@angular/core";
import { RouterLink } from "@angular/router";
import { RichContentComponent, SkeletonComponent, SkeletonTextComponent } from "@bari77/gc-ui";
import { GuildPostFormComponent } from "@features/guilds/components/guild-post-form/guild-post-form.component";
import { GamePost } from "@features/guilds/models/game-post.model";
import { postVisibilityLabel } from "@features/guilds/models/post-visibility";
import { GamePostDraft, GuildWallStore } from "@features/guilds/stores/guild-wall.store";
import { NbButtonModule, NbCardModule } from "@nebular/theme";

@Component({
    standalone: true,
    selector: "wow-guild-wall",
    imports: [
        DatePipe,
        RouterLink,
        GuildPostFormComponent,
        NbButtonModule,
        NbCardModule,
        SkeletonComponent,
        SkeletonTextComponent,
        RichContentComponent,
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

    protected readonly postPlaceholders = [0, 1, 2];

    /** Public id of the post being rewritten; only its author ever gets there. */
    protected readonly editingId = signal<string | null>(null);

    /** Set after a member's post landed in the queue, since nothing appears on the wall. */
    protected readonly queuedNotice = signal(false);

    private readonly composer = viewChild<GuildPostFormComponent>("composer");

    public async ngOnInit(): Promise<void> {
        await this.store.load(this.guildPublicId(), this.canModerate());
    }

    protected async publish(draft: GamePostDraft): Promise<void> {
        const post = await this.store.publish(draft);
        if (!post) {
            return;
        }

        this.composer()?.reset();
        this.queuedNotice.set(post.isPending());
    }

    protected async saveEdit(post: GamePost, draft: GamePostDraft): Promise<void> {
        const saved = await this.store.edit(post.publicId, draft);
        if (!saved) {
            return;
        }

        this.editingId.set(null);
        // A member's edit needs a fresh review, which drops the post off the wall until then.
        this.queuedNotice.set(saved.isPending() && !this.canModerate());
    }

    protected startEdit(post: GamePost): void {
        this.store.errorCode.set(null);
        this.queuedNotice.set(false);
        this.editingId.set(post.publicId);
    }

    protected cancelEdit(): void {
        this.editingId.set(null);
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
        return this.canModerate() || this.isAuthor(post);
    }

    /** Officers moderate what they are shown; rewriting is the author's own business. */
    protected isAuthor(post: GamePost): boolean {
        return post.isMine(this.playerPublicId());
    }

    protected visibilityLabel(post: GamePost): string {
        return postVisibilityLabel(post.visibility);
    }
}
