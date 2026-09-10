import { Resource } from "@angular/core";

/**
 * Resource helpers (loading state, etc.).
 */
export class ResourceUtils {
    /**
     * No server data is available yet, and a request is scheduled or running.
     *
     * Unlike `isLoading()`, covers the `idle` status of the first change detection cycle, during
     * which the view would otherwise show empty content. Excludes `reloading`, where the previous
     * value stays displayable: a skeleton there would hide data already on screen.
     */
    public static isPending(resource: Resource<unknown>): boolean {
        const status = resource.status();
        return status === "idle" || status === "loading";
    }
}
