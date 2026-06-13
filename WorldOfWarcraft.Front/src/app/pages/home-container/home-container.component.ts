import { Component, inject } from "@angular/core";
import { ClassesStore } from "@features/classes/stores/classes.store";
import { GameVideoComponent } from "@shared/components/game-video/game-video.component";

@Component({
    standalone: true,
    selector: "wow-home-container",
    imports: [GameVideoComponent],
    templateUrl: "./home-container.component.html",
    styleUrl: "./home-container.component.scss",
})
export class HomeContainerComponent {
    public readonly classesStore = inject(ClassesStore);
}
