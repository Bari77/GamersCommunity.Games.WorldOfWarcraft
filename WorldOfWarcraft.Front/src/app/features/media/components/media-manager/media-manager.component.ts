import { Component, input } from "@angular/core";
import { PlayerMediaKind } from "@bari77/gc-sdk";
import { PlayerMediaManagerComponent, PlayerMediaManagerLabels } from "@bari77/gc-widgets";

@Component({
    standalone: true,
    selector: "wow-media-manager",
    imports: [PlayerMediaManagerComponent],
    templateUrl: "./media-manager.component.html",
    styleUrl: "./media-manager.component.scss",
})
export class MediaManagerComponent {
    public readonly playerPublicId = input.required<string>();
    public readonly kind = input.required<PlayerMediaKind>();

    protected readonly labels: PlayerMediaManagerLabels = {
        emptyPhoto: $localize`:@@wow.media.emptyPhoto:No picture shared yet.`,
        emptyVideo: $localize`:@@wow.media.emptyVideo:No video shared yet.`,
        emptyStream: $localize`:@@wow.media.emptyStream:No stream declared yet.`,
    };
}
