import { DatePipe } from "@angular/common";
import { Component, effect, inject, input, output, resource, signal, untracked } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CharactersService } from "@features/characters/services/characters.service";
import { GuildUpdateRequestDto } from "@features/guilds/dto/guild.dto";
import {
    GUILD_ORIENTATION_OPTIONS,
    GUILD_ORIENTATION_PVE,
    guildOrientationLabel,
} from "@features/guilds/models/guild-orientation";
import { GuildSheet } from "@features/guilds/models/guild.model";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";
import { NbButtonModule, NbInputModule, NbSelectModule } from "@nebular/theme";
import { firstValueFrom } from "rxjs";

/** Level, playstyle and server of a guild, editable in place by an officer from the widget chrome. */
@Component({
    standalone: true,
    selector: "wow-guild-stats",
    imports: [DatePipe, FormsModule, GameTermPipe, NbButtonModule, NbInputModule, NbSelectModule],
    templateUrl: "./guild-stats.component.html",
    styleUrl: "./guild-stats.component.scss",
})
export class GuildStatsComponent {
    public readonly sheet = input.required<GuildSheet>();
    public readonly editing = input(false);
    public readonly saving = input(false);
    public readonly errorCode = input<string | null>(null);

    public readonly save = output<GuildUpdateRequestDto>();
    public readonly cancel = output<void>();

    protected readonly orientationOptions = GUILD_ORIENTATION_OPTIONS;

    protected readonly level = signal(1);
    protected readonly orientation = signal(GUILD_ORIENTATION_PVE);
    protected readonly idServer = signal<number | null>(null);

    private readonly characters = inject(CharactersService);

    protected readonly servers = resource({
        loader: () => firstValueFrom(this.characters.options()).then((options) => options.servers),
        defaultValue: [],
    });

    public constructor() {
        effect(() => {
            const editing = this.editing();
            untracked(() => {
                if (editing) {
                    const sheet = this.sheet();
                    this.level.set(sheet.level);
                    this.orientation.set(sheet.orientationName || GUILD_ORIENTATION_PVE);
                    this.idServer.set(sheet.idServer);
                }
            });
        });
    }

    protected orientationLabel(): string {
        return guildOrientationLabel(this.sheet().orientationName);
    }

    protected submit(): void {
        const sheet = this.sheet();
        const request: GuildUpdateRequestDto = {};

        const level = Number(this.level());
        if (Number.isInteger(level) && level !== sheet.level) {
            request.level = level;
        }

        if (this.orientation() !== sheet.orientationName) {
            request.orientation = this.orientation();
        }

        const idServer = this.idServer();
        if (idServer !== null && idServer !== sheet.idServer) {
            request.idServer = idServer;
        }

        this.cancel.emit();
        if (Object.keys(request).length > 0) {
            this.save.emit(request);
        }
    }
}
