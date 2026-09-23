import { Component, inject, input, OnInit, output, signal, viewChild } from "@angular/core";
import {
    EntityWallComponent,
    EntityWallComposerDirective,
    EntityWallEditDirective,
    EntityWallExtrasDirective,
    type EntityWallLabels,
} from "@bari77/gc-widgets";
import { GuildPostFormComponent } from "@features/guilds/components/guild-post-form/guild-post-form.component";
import { GamePost } from "@features/guilds/models/game-post.model";
import { postVisibilityLabel } from "@features/guilds/models/post-visibility";
import { GamePostDraft, GuildWallStore } from "@features/guilds/stores/guild-wall.store";

@Component({
    standalone: true,
    selector: "wow-guild-wall",
    imports: [
        EntityWallComponent,
        EntityWallComposerDirective,
        EntityWallEditDirective,
        EntityWallExtrasDirective,
        GuildPostFormComponent,
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
    public readonly moderated = output<void>();

    protected readonly store = inject(GuildWallStore);
    protected readonly queuedNotice = signal(false);
    protected readonly labels: EntityWallLabels = {
        title: $localize`:@@wow.guild.wall.title:Guild wall`,
        queue: $localize`:@@wow.guild.wall.queue:Awaiting review`,
        queueEmpty: $localize`:@@wow.guild.wall.queueEmpty:Nothing waiting for a decision.`,
        empty: $localize`:@@wow.guild.wall.empty:The wall is empty for now.`,
        queued: $localize`:@@wow.guild.wall.queued:Sent. An officer will review it shortly.`,
        edit: $localize`:@@wow.guild.wall.edit:Edit`,
        approve: $localize`:@@wow.guild.wall.approve:Approve`,
        reject: $localize`:@@wow.guild.wall.reject:Reject`,
        delete: $localize`:@@wow.guild.wall.delete:Delete`,
        loadMore: $localize`:@@wow.guild.wall.loadMore:Load more`,
    };
    protected readonly audiencePrefix = $localize`:@@wow.guild.wall.audience:Readable from`;

    private readonly composer = viewChild<GuildPostFormComponent>("composer");
    private readonly wall = viewChild(EntityWallComponent);

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

        this.wall()?.clearEditing();
        this.queuedNotice.set(saved.isPending() && !this.canModerate());
    }

    protected cancelEdit(): void {
        this.wall()?.clearEditing();
    }

    protected onEditStart(): void {
        this.store.errorCode.set(null);
        this.queuedNotice.set(false);
    }

    protected async moderate(event: { post: { publicId: string }; approve: boolean }): Promise<void> {
        if (await this.store.moderate(event.post.publicId, event.approve)) {
            this.moderated.emit();
        }
    }

    protected async remove(post: { publicId: string }): Promise<void> {
        if (await this.store.remove(post.publicId)) {
            this.moderated.emit();
        }
    }

    protected asGamePost(post: unknown): GamePost {
        return post as GamePost;
    }

    protected visibilityLabel(post: GamePost): string {
        return postVisibilityLabel(post.visibility);
    }
}
