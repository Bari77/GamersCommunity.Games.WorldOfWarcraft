import { Component, computed, effect, input, output, signal, untracked } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { GuildUpdateRequestDto } from "@features/guilds/dto/guild.dto";
import { GuildSheet } from "@features/guilds/models/guild.model";
import { NbButtonModule, NbCardModule, NbInputModule } from "@nebular/theme";

@Component({
    standalone: true,
    selector: "wow-guild-admin",
    imports: [FormsModule, NbButtonModule, NbCardModule, NbInputModule],
    templateUrl: "./guild-admin.component.html",
    styleUrl: "./guild-admin.component.scss",
})
export class GuildAdminComponent {
    public readonly sheet = input.required<GuildSheet>();
    public readonly saving = input(false);
    public readonly errorCode = input<string | null>(null);

    public readonly save = output<GuildUpdateRequestDto>();
    public readonly disband = output<string>();

    protected readonly sentence = signal("");
    protected readonly linkDiscord = signal("");
    protected readonly linkForum = signal("");

    protected readonly disbandOpen = signal(false);
    protected readonly confirmation = signal("");

    protected readonly disbandPlaceholder = computed(() => this.sheet().handleLabel());

    /** Typing the full handle is the only way to arm the button, as the microservice requires it. */
    protected readonly canDisband = computed(
        () => !this.saving() && this.confirmation().trim() === this.sheet().handleLabel(),
    );

    public constructor() {
        effect(() => {
            const sheet = this.sheet();
            untracked(() => {
                this.sentence.set(sheet.sentence ?? "");
                this.linkDiscord.set(sheet.linkDiscord ?? "");
                this.linkForum.set(sheet.linkForum ?? "");
            });
        });
    }

    /**
     * Only the touched fields are sent: an absent field keeps its value, while a field sent as
     * null erases it, the only way to remove an optional link.
     */
    protected submit(): void {
        const sheet = this.sheet();
        const request: GuildUpdateRequestDto = {};

        const sentence = this.sentence().trim() || null;
        if (sentence !== sheet.sentence) {
            request.sentence = sentence;
        }

        const linkDiscord = this.linkDiscord().trim() || null;
        if (linkDiscord !== sheet.linkDiscord) {
            request.linkDiscord = linkDiscord;
        }

        const linkForum = this.linkForum().trim() || null;
        if (linkForum !== sheet.linkForum) {
            request.linkForum = linkForum;
        }

        if (Object.keys(request).length > 0) {
            this.save.emit(request);
        }
    }
}
