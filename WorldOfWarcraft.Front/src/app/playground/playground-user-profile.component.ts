import { Component, computed, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { WOW_GAME_URL } from "@core/constants/game.constants";
import { NbButtonModule, NbCardModule } from "@nebular/theme";
import { mockPortraitUrl, personaByPlatformId } from "../../mocks/data/portraits";

/** Stand-in for the Platform community profile while the game runs on its own playground. */
@Component({
    standalone: true,
    selector: "wow-playground-user-profile",
    imports: [RouterLink, NbButtonModule, NbCardModule],
    template: `
        <section class="playground-user gc-enter">
            <nb-card>
                <nb-card-header i18n="@@wow.playground.user.title">Community profile</nb-card-header>
                <nb-card-body class="playground-user__body">
                    <img class="playground-user__avatar" [src]="avatarUrl()" [alt]="handle()" />
                    <div>
                        <h1 class="playground-user__handle gc-display">{{ handle() }}</h1>
                        <p class="playground-user__hint" i18n="@@wow.playground.user.hint">
                            In production this page lives on the Platform. The playground only stubs it so game links
                            keep working.
                        </p>
                    </div>
                </nb-card-body>
                @if (playerPublicId(); as playerId) {
                    <nb-card-footer>
                        <a nbButton status="primary" [routerLink]="[gameUrl, 'players', playerId]">
                            <span i18n="@@wow.playground.user.sheet">Open the game sheet</span>
                        </a>
                    </nb-card-footer>
                }
            </nb-card>
        </section>
    `,
    styles: `
        .playground-user {
            width: 100%;
            max-width: 40rem;
            margin: 1.5rem auto;
            padding: 0 1rem;
        }

        .playground-user__body {
            display: flex;
            gap: 1rem;
            align-items: center;
        }

        .playground-user__avatar {
            width: 4.5rem;
            height: 4.5rem;
            border-radius: 999px;
            object-fit: cover;
        }

        .playground-user__handle {
            margin: 0;
            font-size: 1.4rem;
        }

        .playground-user__hint {
            margin: 0.35rem 0 0;
            font-size: 0.85rem;
            opacity: 0.7;
        }
    `,
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
