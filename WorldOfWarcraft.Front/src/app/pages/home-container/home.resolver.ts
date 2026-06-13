import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { LoadingStore } from "@core/stores/loading.store";
import { ClassesStore } from "@features/classes/stores/classes.store";

export const homeResolver: ResolveFn<void> = async () => {
    const loadingStore = inject(LoadingStore);
    const classesStore = inject(ClassesStore);

    loadingStore.loading.set(true);

    try {
        classesStore.reload();
        await classesStore.loaded();
    } finally {
        loadingStore.loading.set(false);
    }
};
