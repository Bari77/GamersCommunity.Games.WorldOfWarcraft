import { Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { PlatformSessionService } from "@core/services/platform-session.service";
import { PlayersService } from "@features/players/services/players.service";
import { NbButtonModule, NbSpinnerModule } from "@nebular/theme";
import { firstValueFrom } from "rxjs";

@Component({
    standalone: true,
    selector: "wow-my-sheet",
    imports: [NbButtonModule, NbSpinnerModule],
    templateUrl: "./my-sheet.component.html",
    styleUrl: "./my-sheet.component.scss",
})
export class MySheetComponent {
    public readonly loading = signal(true);
    public readonly needsLogin = signal(false);

    private readonly platformSession = inject(PlatformSessionService);
    private readonly players = inject(PlayersService);
    private readonly router = inject(Router);

    public constructor() {
        void this.bootstrap();
    }

    private async bootstrap(): Promise<void> {
        try {
            const session = await firstValueFrom(this.platformSession.touch());
            const sheet = await firstValueFrom(
                this.players.load({
                    platformUserId: session.id,
                    platformUserPublicId: session.publicId,
                }),
            );
            await this.router.navigate(["/world-of-warcraft/players", sheet.publicId]);
        } catch {
            this.needsLogin.set(true);
        } finally {
            this.loading.set(false);
        }
    }
}
