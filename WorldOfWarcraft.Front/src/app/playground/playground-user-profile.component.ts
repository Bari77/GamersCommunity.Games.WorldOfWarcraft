import { Component, computed, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { WOW_GAME_URL } from "@core/constants/game.constants";
import { NbButtonModule, NbCardModule } from "@nebular/theme";
import { mockPortraitUrl, personaByPlatformId } from "../../mocks/catalog/personas";
import { PlaygroundSessionComponent } from "./playground-session.component";

/** Stand-in for the Platform community profile while the game runs on its own playground. */
@Component({
    standalone: true,
    selector: "wow-playground-user-profile",
    imports: [RouterLink, NbButtonModule, NbCardModule, PlaygroundSessionComponent],
    templateUrl: "./playground-user-profile.component.html",
    styleUrl: "./playground-user-profile.component.scss",
})
export class PlaygroundUserProfileComponent {
    public readonly publicId = input.required<string>();

    protected readonly gameUrl = WOW_GAME_URL;

    protected readonly persona = computed(() => personaByPlatformId(this.publicId()));

    protected readonly handle = computed(() => {
        const persona = this.persona();
        return persona ? `${persona.nickname}#${persona.discriminator}` : this.publicId();
    });

    protected readonly avatarUrl = computed(() => mockPortraitUrl(this.persona()?.nickname ?? this.publicId()));

    protected readonly playerPublicId = computed(() => this.persona()?.playerPublicId ?? null);
}
