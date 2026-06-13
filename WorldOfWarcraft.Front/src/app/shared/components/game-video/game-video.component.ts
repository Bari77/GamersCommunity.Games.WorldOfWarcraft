import { AfterViewInit, Component, ElementRef, computed, input, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
    standalone: true,
    selector: "wow-game-video",
    imports: [CommonModule],
    templateUrl: "./game-video.component.html",
    styleUrl: "./game-video.component.scss",
})
export class GameVideoComponent implements AfterViewInit {
    @ViewChild("introVideo") private videoRef!: ElementRef<HTMLVideoElement>;

    public name = input<string>("");

    public src = computed<string>(() => `https://host.bariserv.net/GamersCommunity/Videos/${this.name()}_intro.mp4`);
    public poster = computed<string>(
        () => `https://host.bariserv.net/GamersCommunity/Videos/${this.name()}_intro.png`,
    );

    public ngAfterViewInit(): void {
        setTimeout(() => {
            const video = this.videoRef.nativeElement;
            video.muted = true;
            video.play();
        }, 20);
    }
}
