import { Component, inject } from "@angular/core";
import { DatePipe } from "@angular/common";
import { HomeLatestPlayersComponent } from "@features/home/components/home-latest-players/home-latest-players.component";
import { LfgChatComponent } from "@features/lfg/components/lfg-chat/lfg-chat.component";
import { HomeFeedStore } from "@features/home/stores/home-feed.store";
import { RouterLink } from "@angular/router";
import { NbCardModule, NbSpinnerModule } from "@nebular/theme";

@Component({
    standalone: true,
    selector: "wow-home-container",
    imports: [DatePipe, RouterLink, NbCardModule, NbSpinnerModule, LfgChatComponent, HomeLatestPlayersComponent],
    providers: [HomeFeedStore],
    templateUrl: "./home-container.component.html",
    styleUrl: "./home-container.component.scss",
})
export class HomeContainerComponent {
    public readonly store = inject(HomeFeedStore);
}
