import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "gameTerm", standalone: true })
export class GameTermPipe implements PipeTransform {
    public transform(value: string | null | undefined): string {
        if (!value) {
            return "";
        }

        const words = value.split("_").filter(Boolean);
        return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    }
}
