import { CreateWallComponent } from "@bari77/gc-ui";
import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import { GameMembershipStore } from "@core/stores/game-membership.store";

/**
 * Stands in for an interaction reserved for players who own a sheet, and creates it on demand.
 *
 * Callers decide when to show it — typically on `needsSheet()` — and may reword the message to
 * name the feature being unlocked.
 */
@Component({
    standalone: true,
    selector: "wow-create-sheet-wall",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CreateWallComponent],
    template: `
        <gc-create-wall
            [variant]="variant()"
            [heading]="heading()"
            [message]="message()"
            [actionLabel]="actionLabel"
            [busy]="membership.creating()"
            (action)="create()"
        />
    `,
    styles: [
        `
            :host {
                display: block;
            }
        `,
    ],
})
export class CreateSheetWallComponent {
    public readonly variant = input<"block" | "inline">("block");

    public readonly heading = input($localize`:@@wow.sheet.wall.heading:No player profile yet`);

    public readonly message = input(
        $localize`:@@wow.sheet.wall.message:Create your player profile to register your characters, post ads and join a guild.`,
    );

    protected readonly actionLabel = $localize`:@@wow.sheet.wall.action:Create my profile`;

    protected readonly membership = inject(GameMembershipStore);

    protected create(): void {
        void this.membership.createSheetAndOpen();
    }
}
