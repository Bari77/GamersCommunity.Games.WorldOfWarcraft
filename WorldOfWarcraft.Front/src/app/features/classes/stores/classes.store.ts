import { inject, Injectable, resource } from "@angular/core";
import { ClassesService } from "@features/classes/services/classes.service";
import { PromiseUtils } from "@shared/utils/promise.utils";
import { firstValueFrom } from "rxjs";

@Injectable()
export class ClassesStore {
    public readonly classes = resource({
        loader: () => firstValueFrom(this.classesService.list()),
        defaultValue: [],
    });

    private readonly classesService = inject(ClassesService);

    public reload(): void {
        this.classes.reload();
    }

    public async loaded(): Promise<void> {
        return PromiseUtils.waitUntilFalse(() => this.classes.isLoading());
    }
}
