import { Component, input, output, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { PlayerUpdateRequestDto } from "@features/players/dto/player.dto";
import { PlayerSheet } from "@features/players/models/player.model";
import { NbButtonModule, NbIconModule, NbInputModule } from "@nebular/theme";

/** Counters of a player sheet, editable in place by its owner. */
@Component({
    standalone: true,
    selector: "wow-player-stats",
    imports: [FormsModule, NbButtonModule, NbIconModule, NbInputModule],
    templateUrl: "./player-stats.component.html",
    styleUrl: "./player-stats.component.scss",
})
export class PlayerStatsComponent {
    public readonly sheet = input.required<PlayerSheet>();
    public readonly canEdit = input(false);
    public readonly saving = input(false);

    public readonly save = output<PlayerUpdateRequestDto>();

    protected readonly editing = signal(false);

    /** Both hold null while their field is empty, which the number input reports as such. */
    protected readonly mounts = signal<number | null>(0);
    protected readonly points = signal<number | null>(null);

    protected open(): void {
        this.mounts.set(this.sheet().nbMount);
        this.points.set(this.sheet().successPoints);
        this.editing.set(true);
    }

    /** Only the counters the owner actually moved are sent, one PUT field each. */
    protected submit(): void {
        const sheet = this.sheet();
        const request: PlayerUpdateRequestDto = {};

        const mounts = this.mounts();
        if (mounts !== null && Number.isInteger(mounts) && mounts !== sheet.nbMount) {
            request.nbMount = mounts;
        }

        const points = this.points();
        if (points !== sheet.successPoints && (points === null || Number.isInteger(points))) {
            request.successPoints = points;
        }

        this.editing.set(false);
        if (Object.keys(request).length > 0) {
            this.save.emit(request);
        }
    }
}
