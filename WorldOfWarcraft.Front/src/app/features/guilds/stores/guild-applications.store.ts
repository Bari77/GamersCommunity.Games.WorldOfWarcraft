import { inject, Injectable, signal } from "@angular/core";
import { APPLICATION_PENDING, GuildApplication } from "@features/guilds/models/guild-application.model";
import { GuildApplicationsService } from "@features/guilds/services/guild-applications.service";
import { firstValueFrom } from "rxjs";

@Injectable()
export class GuildApplicationsStore {
    public readonly applications = signal<GuildApplication[]>([]);
    public readonly loading = signal(true);
    public readonly reviewing = signal<string | null>(null);
    public readonly errorCode = signal<string | null>(null);

    private readonly service = inject(GuildApplicationsService);

    public async load(guildPublicId: string): Promise<void> {
        this.loading.set(true);
        try {
            this.applications.set(
                await firstValueFrom(this.service.listForGuild({ guildPublicId, status: APPLICATION_PENDING })),
            );
        } catch {
            this.applications.set([]);
        } finally {
            this.loading.set(false);
        }
    }

    public async review(publicId: string, accept: boolean): Promise<boolean> {
        if (this.reviewing()) {
            return false;
        }

        this.reviewing.set(publicId);
        this.errorCode.set(null);
        try {
            await firstValueFrom(this.service.review({ publicId, accept }));
            this.applications.update((current) => current.filter((item) => item.publicId !== publicId));
            return true;
        } catch (err: unknown) {
            this.errorCode.set((err as { error?: { Code?: string } })?.error?.Code ?? "UNKNOWN");
            return false;
        } finally {
            this.reviewing.set(null);
        }
    }
}
