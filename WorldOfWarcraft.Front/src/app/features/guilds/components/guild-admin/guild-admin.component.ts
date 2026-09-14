import { Component, computed, effect, input, output, signal, untracked } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { GuildCrestEditorComponent } from "@features/guilds/components/guild-crest-editor/guild-crest-editor.component";
import { GuildUpdateRequestDto } from "@features/guilds/dto/guild.dto";
import { GUILD_ORIENTATION_OPTIONS, GUILD_ORIENTATION_PVE } from "@features/guilds/models/guild-orientation";
import { GuildSheet } from "@features/guilds/models/guild.model";
import { NbButtonModule, NbCardModule, NbInputModule, NbSelectModule } from "@nebular/theme";
import { GuildCrest } from "@shared/models/guild-crest";

@Component({
    standalone: true,
    selector: "wow-guild-admin",
    imports: [
        FormsModule,
        GuildCrestEditorComponent,
        NbButtonModule,
        NbCardModule,
        NbInputModule,
        NbSelectModule,
    ],
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
    protected readonly level = signal(1);
    protected readonly orientation = signal(GUILD_ORIENTATION_PVE);
    protected readonly crest = signal(GuildCrest.fromDto(null));

    protected readonly orientationOptions = GUILD_ORIENTATION_OPTIONS;

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
                this.level.set(sheet.level);
                this.orientation.set(sheet.orientationName || GUILD_ORIENTATION_PVE);
                this.crest.set(sheet.crest);
            });
        });
    }

    /**
     * Only the touched fields are sent: an absent field keeps its value, while a field sent as
     * null erases it, the only way to clear the catchphrase.
     */
    protected submit(): void {
        const sheet = this.sheet();
        const request: GuildUpdateRequestDto = {};

        const sentence = this.sentence().trim() || null;
        if (sentence !== sheet.sentence) {
            request.sentence = sentence;
        }

        const level = Number(this.level());
        if (Number.isInteger(level) && level !== sheet.level) {
            request.level = level;
        }

        if (this.orientation() !== sheet.orientationName) {
            request.orientation = this.orientation();
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
