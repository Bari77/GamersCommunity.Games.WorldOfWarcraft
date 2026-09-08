import { DatePipe } from "@angular/common";
import { Component, computed, effect, inject, input, resource, signal, untracked } from "@angular/core";
import { RouterLink } from "@angular/router";
import {
    cloneLayout,
    parseLayout,
    serializeLayout,
    WidgetDefDirective,
    WidgetEditBarComponent,
    WidgetGridComponent,
    WidgetLayout,
} from "@bari77/gc-widgets";
import { PlatformSession, PlatformSessionService } from "@core/services/platform-session.service";
import { CharacterListComponent } from "@features/characters/components/character-list/character-list.component";
import {
    PLAYER_DASHBOARD_COLUMNS,
    PLAYER_DASHBOARD_LAYOUT,
    PLAYER_DASHBOARD_ROW_HEIGHT,
} from "@features/players/models/player-dashboard.layout";
import { PlayerSheet } from "@features/players/models/player.model";
import { PlayersService } from "@features/players/services/players.service";
import { NbButtonModule, NbCardModule, NbSpinnerModule } from "@nebular/theme";
import { firstValueFrom } from "rxjs";

@Component({
    standalone: true,
    selector: "wow-player-sheet",
    imports: [
        CharacterListComponent,
        DatePipe,
        NbCardModule,
        NbButtonModule,
        NbSpinnerModule,
        RouterLink,
        WidgetDefDirective,
        WidgetEditBarComponent,
        WidgetGridComponent,
    ],
    templateUrl: "./player-sheet.component.html",
    styleUrl: "./player-sheet.component.scss",
})
export class PlayerSheetComponent {
    public readonly publicId = input.required<string>();

    public readonly columns = PLAYER_DASHBOARD_COLUMNS;
    public readonly rowHeight = PLAYER_DASHBOARD_ROW_HEIGHT;

    public readonly sheet = resource({
        params: () => this.publicId(),
        loader: ({ params }) => firstValueFrom(this.players.getByPublicId(params)),
        defaultValue: undefined as PlayerSheet | undefined,
    });

    public readonly session = resource({
        loader: () => firstValueFrom(this.platformSession.touch()).catch(() => null),
        defaultValue: null as PlatformSession | null,
    });

    public readonly isOwner = computed(() => {
        const sheet = this.sheet.value();
        const session = this.session.value();
        return !!sheet && !!session && sheet.platformUserPublicId === session.publicId;
    });

    public readonly editing = signal(false);
    public readonly saving = signal(false);
    public readonly saveFailed = signal(false);

    public readonly layout = computed(
        () =>
            this.savedLayout() ??
            parseLayout(this.sheet.value()?.layoutJson, PLAYER_DASHBOARD_LAYOUT, PLAYER_DASHBOARD_COLUMNS),
    );

    private readonly savedLayout = signal<WidgetLayout | null>(null);
    private draft: WidgetLayout = [];

    private readonly players = inject(PlayersService);
    private readonly platformSession = inject(PlatformSessionService);

    public constructor() {
        effect(() => {
            this.publicId();
            untracked(() => {
                this.savedLayout.set(null);
                this.editing.set(false);
            });
        });
    }

    public onCharactersChanged(): void {
        this.sheet.reload();
    }

    public onLayoutChange(layout: WidgetLayout): void {
        this.draft = layout;
    }

    public onCancel(): void {
        this.draft = cloneLayout(this.layout());
        this.saveFailed.set(false);
    }

    public async onSave(): Promise<void> {
        const sheet = this.sheet.value();
        if (!sheet) {
            return;
        }

        const layout = this.draft.length > 0 ? this.draft : cloneLayout(this.layout());
        this.saving.set(true);
        this.saveFailed.set(false);
        try {
            await firstValueFrom(this.players.update(sheet.publicId, { layoutJson: serializeLayout(layout) }));
            this.savedLayout.set(layout);
            this.editing.set(false);
        } catch {
            this.saveFailed.set(true);
        } finally {
            this.saving.set(false);
        }
    }
}
