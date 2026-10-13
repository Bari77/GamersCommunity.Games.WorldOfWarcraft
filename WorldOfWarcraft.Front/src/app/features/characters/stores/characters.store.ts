import { computed, inject, Injectable, resource, signal } from "@angular/core";
import { CharacterUpdateRequestDto } from "@features/characters/dto/character.dto";
import { CharacterCreateRequestDto } from "@features/characters/dto/character-create-request.dto";
import { CharacterOptions } from "@features/characters/models/character-options.model";
import { CharactersService } from "@features/characters/services/characters.service";
import { ResourceUtils } from "@shared/utils/resource.utils";
import { firstValueFrom } from "rxjs";

@Injectable()
export class CharactersStore {
    public readonly characters = resource({
        params: () => this.$playerPublicId(),
        loader: ({ params }) => firstValueFrom(this.service.listByPlayer(params)),
        defaultValue: [],
    });

    public readonly options = resource({
        params: () => (this.$optionsRequested() ? true : undefined),
        loader: () => firstValueFrom(this.service.options()),
        defaultValue: undefined as CharacterOptions | undefined,
    });

    public readonly loading = computed(() => ResourceUtils.isPending(this.characters));

    public readonly optionsLoading = computed(() => ResourceUtils.isPending(this.options));
    public readonly saving = computed(() => this.$saving());
    public readonly errorCode = computed(() => this.$errorCode());

    public readonly playerPublicId = computed(() => this.$playerPublicId());
    public readonly optionsRequested = computed(() => this.$optionsRequested());
    private readonly service = inject(CharactersService);
    private readonly $saving = signal(false);
    private readonly $errorCode = signal<string | null>(null);
    private readonly $playerPublicId = signal<string | undefined>(undefined);
    private readonly $optionsRequested = signal(false);

    public setPlayer(publicId: string): void {
        this.$playerPublicId.set(publicId);
    }

    public requestOptions(): void {
        this.$optionsRequested.set(true);
    }

    public clearError(): void {
        this.$errorCode.set(null);
    }

    public create(data: CharacterCreateRequestDto): Promise<boolean> {
        return this.run(() => firstValueFrom(this.service.create(data)));
    }

    public update(publicId: string, data: CharacterUpdateRequestDto): Promise<boolean> {
        return this.run(() => firstValueFrom(this.service.update(publicId, data)));
    }

    public remove(publicId: string): Promise<boolean> {
        return this.run(() => firstValueFrom(this.service.remove(publicId)));
    }

    private async run(action: () => Promise<unknown>): Promise<boolean> {
        this.$saving.set(true);
        this.$errorCode.set(null);
        try {
            await action();
            this.characters.reload();
            return true;
        } catch (err: unknown) {
            this.$errorCode.set((err as { error?: { Code?: string } })?.error?.Code ?? "UNKNOWN");
            return false;
        } finally {
            this.$saving.set(false);
        }
    }
}
