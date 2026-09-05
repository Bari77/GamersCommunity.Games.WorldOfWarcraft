import { computed, inject, Injectable, resource } from "@angular/core";
import { ClassesService } from "@features/classes/services/classes.service";
import { firstValueFrom } from "rxjs";

@Injectable()
export class ClassesStore {
    public readonly classes = resource({
        loader: () => firstValueFrom(this.classesService.list()),
        defaultValue: [],
    });

    public readonly loading = computed(() => this.classes.isLoading());

    private readonly classesService = inject(ClassesService);

    public reload(): void {
        this.classes.reload();
    }
}
