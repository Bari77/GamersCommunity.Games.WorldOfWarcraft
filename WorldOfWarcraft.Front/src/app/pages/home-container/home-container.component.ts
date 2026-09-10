import { Component, computed, inject, signal } from "@angular/core";
import { DatePipe } from "@angular/common";
import { DecisionPromptComponent, SkeletonTextComponent } from "@bari77/gc-ui";
import { CreateSheetWallComponent } from "@shared/components/create-sheet-wall/create-sheet-wall.component";
import { GameMembershipStore } from "@core/stores/game-membership.store";
import { HomeLatestCharactersComponent } from "@features/home/components/home-latest-characters/home-latest-characters.component";
import { HomeLatestPlayersComponent } from "@features/home/components/home-latest-players/home-latest-players.component";
import { LfgChatComponent } from "@features/lfg/components/lfg-chat/lfg-chat.component";
import { HomeFeedStore } from "@features/home/stores/home-feed.store";
import { RouterLink } from "@angular/router";
import { NbCardModule } from "@nebular/theme";

@Component({
    standalone: true,
    selector: "wow-home-container",
    imports: [
        DatePipe,
        RouterLink,
        NbCardModule,
        LfgChatComponent,
        HomeLatestPlayersComponent,
        HomeLatestCharactersComponent,
        CreateSheetWallComponent,
        DecisionPromptComponent,
        SkeletonTextComponent,
    ],
    providers: [HomeFeedStore],
    templateUrl: "./home-container.component.html",
    styleUrl: "./home-container.component.scss",
})
export class HomeContainerComponent {
    public readonly store = inject(HomeFeedStore);
    public readonly membership = inject(GameMembershipStore);

    /** Creating the sheet reloads the whole page, so the feed goes back to skeletons meanwhile. */
    public readonly feedLoading = computed(() => this.store.loading() || this.membership.creating());

    public readonly promptOpen = computed(() => this.membership.shouldPromptSheetCreation() && !this.promptAnswered());

    public readonly promptHeading = $localize`:@@wow.sheet.prompt.heading:Create your player profile?`;
    public readonly promptMessage = $localize`:@@wow.sheet.prompt.message:A player profile lets you register your characters, post ads and join a guild. Without one you can still browse the game freely.`;
    public readonly promptCreateLabel = $localize`:@@wow.sheet.prompt.create:Create my profile`;
    public readonly promptBrowseLabel = $localize`:@@wow.sheet.prompt.browse:Keep browsing anonymously`;
    public readonly promptOptOutLabel = $localize`:@@wow.sheet.prompt.optOut:Don't ask again`;
    public readonly promptBusyLabel = $localize`:@@wow.sheet.prompt.creating:Creating…`;
    public readonly wallHomeMessage = $localize`:@@wow.sheet.wall.homeMessage:Create your player profile to take part in the game community.`;

    public readonly optOut = signal(false);

    /** Answering closes the popup for this visit, whether or not the refusal was made permanent. */
    private readonly promptAnswered = signal(false);

    public onPromptCreate(): void {
        this.promptAnswered.set(true);
        void this.membership.createSheetAndOpen();
    }

    public onPromptDismiss(): void {
        if (this.optOut()) {
            this.membership.dismissPrompt();
        }
        this.promptAnswered.set(true);
    }
}
