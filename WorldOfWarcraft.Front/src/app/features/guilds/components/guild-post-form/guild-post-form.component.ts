import { Component, effect, input, output, signal, untracked } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { GamePost } from "@features/guilds/models/game-post.model";
import { GUILD_RANK_MEMBER } from "@features/guilds/models/guild.model";
import { POST_VISIBILITY_OPTIONS } from "@features/guilds/models/post-visibility";
import { GamePostDraft } from "@features/guilds/stores/guild-wall.store";
import { isRichHtmlBlank, RichEditorComponent } from "@bari77/gc-ui";
import { NbButtonModule, NbInputModule, NbSelectModule } from "@nebular/theme";

/** The three fields of a wall post, used both to publish a new one and to rewrite an existing one. */
@Component({
    standalone: true,
    selector: "wow-guild-post-form",
    imports: [FormsModule, RichEditorComponent, NbButtonModule, NbInputModule, NbSelectModule],
    templateUrl: "./guild-post-form.component.html",
    styleUrl: "./guild-post-form.component.scss",
})
export class GuildPostFormComponent {
    /** The post being rewritten, or null when composing a new one. */
    public readonly post = input<GamePost | null>(null);

    public readonly saving = input(false);
    public readonly errorCode = input<string | null>(null);

    /** Officers publish straight away; everyone else warrants the review warning. */
    public readonly moderated = input(false);

    public readonly save = output<GamePostDraft>();
    public readonly cancel = output<void>();

    protected readonly visibilityOptions = POST_VISIBILITY_OPTIONS;

    protected readonly bodyPlaceholder = $localize`:@@wow.guild.wall.bodyPlaceholder:Share something with the guild…`;
    protected readonly mediaPlaceholder = $localize`:@@wow.guild.wall.mediaPlaceholder:Image link (optional)`;

    protected readonly body = signal("");
    protected readonly mediaUrl = signal("");
    protected readonly visibility = signal<string>(GUILD_RANK_MEMBER);

    public constructor() {
        effect(() => {
            const post = this.post();
            untracked(() => {
                this.body.set(post?.body ?? "");
                this.mediaUrl.set(post?.mediaUrl ?? "");
                this.visibility.set(post?.visibility ?? GUILD_RANK_MEMBER);
            });
        });
    }

    /** Called by the wall once a new post went through, since the composer stays mounted. */
    public reset(): void {
        this.body.set("");
        this.mediaUrl.set("");
        this.visibility.set(GUILD_RANK_MEMBER);
    }

    protected isBodyBlank(): boolean {
        return isRichHtmlBlank(this.body());
    }

    protected submit(): void {
        const body = this.body();
        if (isRichHtmlBlank(body) || this.saving()) {
            return;
        }

        this.save.emit({
            body,
            mediaUrl: this.mediaUrl().trim() || null,
            visibility: this.visibility(),
        });
    }
}
