import { Component, computed, effect, input, output, signal, untracked } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { GuildCrestEditorComponent } from "@features/guilds/components/guild-crest-editor/guild-crest-editor.component";
import { GuildUpdateRequestDto } from "@features/guilds/dto/guild.dto";
import { GuildSheet } from "@features/guilds/models/guild.model";
import { NbButtonModule, NbCardModule, NbInputModule } from "@nebular/theme";
import { GuildCrest } from "@shared/models/guild-crest";

@Component({
    standalone: true,
    selector: "wow-guild-admin",
    imports: [FormsModule, GuildCrestEditorComponent, NbButtonModule, NbCardModule, NbInputModule],
    templateUrl: "./guild-admin.component.html",
    styleUrl: "./guild-admin.component.scss",
})
export class GuildAdminComponent {
    public readonly sheet = input.required<GuildSheet>();
    public readonly saving = input(false);
    public readonly errorCode = input<string | null>(null);

    public readonly save = output<GuildUpdateRequestDto>();
    public readonly disband = output<string>();

    protected readonly entitled = signal("");
    protected readonly crest = signal(GuildCrest.fromDto(null));

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
                this.entitled.set(sheet.entitled);
                this.crest.set(sheet.crest);
            });
        });
    }

    /**
     * Only the touched fields are sent: an absent field keeps its value.
     */
    protected submit(): void {
        const sheet = this.sheet();
        const request: GuildUpdateRequestDto = {};

        const entitled = this.entitled().trim();
        if (entitled !== sheet.entitled) {
            request.entitled = entitled;
        }

        // The editor hands back a new crest on every tweak, so identity tells a touched one apart.
        if (this.crest() !== sheet.crest) {
            request.crest = this.crest().toDto();
        }

        if (Object.keys(request).length > 0) {
            this.save.emit(request);
        }
    }
}
