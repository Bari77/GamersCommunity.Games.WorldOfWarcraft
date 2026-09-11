import { computed, inject, Injectable, signal } from "@angular/core";
import { GuildUpdateRequestDto } from "@features/guilds/dto/guild.dto";
import { GuildSheet } from "@features/guilds/models/guild.model";
import { GuildApplicationsService } from "@features/guilds/services/guild-applications.service";
import { GuildsService } from "@features/guilds/services/guilds.service";
import { firstValueFrom, Observable } from "rxjs";

@Injectable()
export class GuildSheetStore {
    public readonly sheet = signal<GuildSheet | null>(null);
    public readonly loading = signal(true);
    public readonly notFound = signal(false);
    public readonly saving = signal(false);
    public readonly errorCode = signal<string | null>(null);

    public readonly canModerate = computed(() => this.sheet()?.canModerate() ?? false);
    public readonly isLeader = computed(() => this.sheet()?.isLeader() ?? false);
    public readonly isMember = computed(() => this.sheet()?.isMember() ?? false);

    private readonly guilds = inject(GuildsService);
    private readonly applications = inject(GuildApplicationsService);
    private publicId: string | null = null;

    public async load(publicId: string): Promise<void> {
        this.publicId = publicId;
        this.loading.set(true);
        this.notFound.set(false);
        try {
            this.sheet.set(await firstValueFrom(this.guilds.getByPublicId(publicId)));
        } catch {
            this.sheet.set(null);
            this.notFound.set(true);
        } finally {
            this.loading.set(false);
        }
    }

    /** Re-reads the sheet so counters and the viewer standing follow a change made elsewhere. */
    public async refresh(): Promise<void> {
        if (!this.publicId) {
            return;
        }
        try {
            this.sheet.set(await firstValueFrom(this.guilds.getByPublicId(this.publicId)));
        } catch {
            // The displayed sheet stays valid; only the counters are one action behind.
        }
    }

    public updateProfile(request: GuildUpdateRequestDto): Promise<boolean> {
        return this.mutate((publicId) => this.guilds.update(publicId, request));
    }

    public setRank(characterPublicId: string, rank: string): Promise<boolean> {
        return this.mutate((guildPublicId) => this.guilds.setRank({ guildPublicId, characterPublicId, rank }));
    }

    public kick(characterPublicId: string): Promise<boolean> {
        return this.mutate((guildPublicId) => this.guilds.kick({ guildPublicId, characterPublicId }));
    }

    public transferLeadership(characterPublicId: string): Promise<boolean> {
        return this.mutate((guildPublicId) => this.guilds.transferLeadership({ guildPublicId, characterPublicId }));
    }

    public async leave(characterPublicId: string): Promise<boolean> {
        const guildPublicId = this.publicId;
        if (!guildPublicId) {
            return false;
        }

        return this.run(async () => {
            await firstValueFrom(this.guilds.leave({ guildPublicId, characterPublicId }));
            await this.refresh();
        });
    }

    public async disband(confirmation: string): Promise<boolean> {
        const guildPublicId = this.publicId;
        if (!guildPublicId) {
            return false;
        }

        return this.run(() => firstValueFrom(this.guilds.disband({ guildPublicId, confirmation })));
    }

    public async apply(characterPublicId: string, message: string): Promise<boolean> {
        const guildPublicId = this.publicId;
        if (!guildPublicId) {
            return false;
        }

        return this.run(async () => {
            await firstValueFrom(this.applications.create({ guildPublicId, characterPublicId, message }));
            await this.refresh();
        });
    }

    public async withdrawApplication(): Promise<boolean> {
        const publicId = this.sheet()?.viewerApplicationPublicId;
        if (!publicId) {
            return false;
        }

        return this.run(async () => {
            await firstValueFrom(this.applications.withdraw({ publicId }));
            await this.refresh();
        });
    }

    private mutate(action: (guildPublicId: string) => Observable<GuildSheet>): Promise<boolean> {
        const guildPublicId = this.publicId;
        if (!guildPublicId) {
            return Promise.resolve(false);
        }

        return this.run(async () => {
            this.sheet.set(await firstValueFrom(action(guildPublicId)));
        });
    }

    private async run(action: () => Promise<unknown>): Promise<boolean> {
        this.saving.set(true);
        this.errorCode.set(null);
        try {
            await action();
            return true;
        } catch (err: unknown) {
            this.errorCode.set((err as { error?: { Code?: string } })?.error?.Code ?? "UNKNOWN");
            return false;
        } finally {
            this.saving.set(false);
        }
    }
}
