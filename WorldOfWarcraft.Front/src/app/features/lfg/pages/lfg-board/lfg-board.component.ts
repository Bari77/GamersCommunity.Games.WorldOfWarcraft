import { DatePipe } from "@angular/common";
import { Component, computed, inject, OnInit, resource } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { SkeletonComponent, SkeletonTextComponent } from "@bari77/gc-ui";
import { WOW_GAME_URL } from "@core/constants/game.constants";
import { CharacterOptions } from "@features/characters/models/character.model";
import { CharactersService } from "@features/characters/services/characters.service";
import { LFG_KIND_PLAYER, LFG_KIND_RECRUITMENT, LfgMessage } from "@features/lfg/models/lfg-message.model";
import { LfgBoardStore } from "@features/lfg/stores/lfg-board.store";
import { NbButtonModule, NbCardModule, NbInputModule, NbSelectModule } from "@nebular/theme";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";
import { ResourceUtils } from "@shared/utils/resource.utils";
import { firstValueFrom } from "rxjs";

const NO_OPTIONS = new CharacterOptions([], [], [], [], [], [], [], 0, 0);

@Component({
    standalone: true,
    selector: "wow-lfg-board",
    imports: [
        DatePipe,
        FormsModule,
        RouterLink,
        GameTermPipe,
        NbButtonModule,
        NbCardModule,
        NbInputModule,
        NbSelectModule,
        SkeletonComponent,
        SkeletonTextComponent,
    ],
    providers: [LfgBoardStore],
    templateUrl: "./lfg-board.component.html",
    styleUrl: "./lfg-board.component.scss",
})
export class LfgBoardComponent implements OnInit {
    protected readonly store = inject(LfgBoardStore);

    protected readonly searchPlaceholder = $localize`:@@wow.lfg.board.searchPlaceholder:Search in the ads`;

    protected readonly kindPlayer = LFG_KIND_PLAYER;
    protected readonly kindRecruitment = LFG_KIND_RECRUITMENT;

    protected readonly adPlaceholders = [0, 1, 2, 3];

    protected readonly options = resource({
        loader: () => firstValueFrom(this.characters.options()),
        defaultValue: NO_OPTIONS,
    });

    protected readonly loadingOptions = computed(() => ResourceUtils.isPending(this.options));

    private readonly characters = inject(CharactersService);

    public async ngOnInit(): Promise<void> {
        await this.store.search();
    }

    protected onSearchSubmit(): void {
        void this.store.search();
    }

    protected onFilterChange(): void {
        void this.store.search();
    }

    /**
     * A guild ad leads to the guild sheet, where the roster gives access to each member's player
     * profile. A player ad leads straight to that player's sheet.
     */
    protected targetLink(ad: LfgMessage): string[] {
        return ad.isGuildAd()
            ? [`${WOW_GAME_URL}/guilds`, ad.guildPublicId!]
            : [`${WOW_GAME_URL}/players`, ad.playerPublicId];
    }
}
