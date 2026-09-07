import { Injectable, inject, signal } from "@angular/core";
import { PlatformUsersService } from "@core/services/platform-users.service";
import { firstValueFrom } from "rxjs";

const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

@Injectable({ providedIn: "root" })
export class PlatformAvatarStore {
    public readonly avatars = signal<Record<string, string>>({});

    private readonly users = inject(PlatformUsersService);
    private readonly pending = new Set<string>();

    public urlFor(
        platformUserPublicId: string,
        options?: {
            sessionPublicId?: string | null;
            sessionAvatarUrl?: string | null;
            fallbackUrl?: string | null;
        },
    ): string {
        if (options?.fallbackUrl) {
            return options.fallbackUrl;
        }
        if (
            options?.sessionPublicId &&
            platformUserPublicId === options.sessionPublicId &&
            options.sessionAvatarUrl
        ) {
            return options.sessionAvatarUrl;
        }
        if (!platformUserPublicId || platformUserPublicId === EMPTY_GUID) {
            return "";
        }
        return this.avatars()[platformUserPublicId] ?? "";
    }

    public async prefetchPublicIds(ids: Iterable<string>): Promise<void> {
        const unique = new Set<string>();
        for (const id of ids) {
            if (id && id !== EMPTY_GUID) {
                unique.add(id);
            }
        }
        await Promise.all([...unique].map((id) => this.ensure(id)));
    }

    public async ensure(publicId: string): Promise<void> {
        if (!publicId || publicId === EMPTY_GUID || this.avatars()[publicId] || this.pending.has(publicId)) {
            return;
        }

        this.pending.add(publicId);
        try {
            const avatarUrl = await firstValueFrom(this.users.getAvatarUrl(publicId));
            if (avatarUrl) {
                this.avatars.update((current) => ({ ...current, [publicId]: avatarUrl }));
            }
        } catch {
            // ignore missing profiles
        } finally {
            this.pending.delete(publicId);
        }
    }
}
