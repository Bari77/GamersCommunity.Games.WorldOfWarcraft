import { Component, computed, inject, input, OnInit, resource } from "@angular/core";
import { Router } from "@angular/router";
import { SkeletonComponent, SkeletonTextComponent } from "@bari77/gc-ui";
import { WOW_GAME_URL } from "@core/constants/game.constants";
import { GameMembershipStore } from "@core/stores/game-membership.store";
import { Character } from "@features/characters/models/character.model";
import { CharactersService } from "@features/characters/services/characters.service";
import { GuildAdminComponent } from "@features/guilds/components/guild-admin/guild-admin.component";
import { GuildApplicationsComponent } from "@features/guilds/components/guild-applications/guild-applications.component";
import {
    GuildApplicationDraft,
    GuildApplyFormComponent,
} from "@features/guilds/components/guild-apply-form/guild-apply-form.component";
import { GuildRosterComponent, RankChange } from "@features/guilds/components/guild-roster/guild-roster.component";
import { GuildWallComponent } from "@features/guilds/components/guild-wall/guild-wall.component";
import { GuildUpdateRequestDto } from "@features/guilds/dto/guild.dto";
import { GuildSheetStore } from "@features/guilds/stores/guild-sheet.store";
import { NbButtonModule, NbCardModule } from "@nebular/theme";
import { CreateSheetWallComponent } from "@shared/components/create-sheet-wall/create-sheet-wall.component";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";
import { ResourceUtils } from "@shared/utils/resource.utils";
import { DatePipe } from "@angular/common";
import { firstValueFrom } from "rxjs";

@Component({
    standalone: true,
    selector: "wow-guild-sheet",
    imports: [
        DatePipe,
        GameTermPipe,
        NbButtonModule,
        NbCardModule,
        SkeletonComponent,
        SkeletonTextComponent,
        CreateSheetWallComponent,
        GuildAdminComponent,
        GuildApplicationsComponent,
        GuildApplyFormComponent,
        GuildRosterComponent,
        GuildWallComponent,
    ],
    providers: [GuildSheetStore],
    templateUrl: "./guild-sheet.component.html",
    styleUrl: "./guild-sheet.component.scss",
})
export class GuildSheetComponent implements OnInit {
    public readonly publicId = input.required<string>();

    protected readonly store = inject(GuildSheetStore);
    protected readonly membership = inject(GameMembershipStore);

    protected readonly sheetWallMessage = $localize`:@@wow.guild.sheetWall:Create your player profile to apply to this guild.`;

    /** Needed both to apply with a free character and to leave the guild with a member one. */
    private readonly myCharacters = resource({
        params: () => this.membership.playerPublicId() ?? undefined,
        loader: ({ params }) => firstValueFrom(this.characters.listByPlayer(params)),
        defaultValue: [] as Character[],
    });

    protected readonly loadingCharacters = computed(
        () => this.membership.loading() || ResourceUtils.isPending(this.myCharacters),
    );

    protected readonly applyCandidates = computed(() =>
        this.myCharacters.value().filter((character) => character.guildPublicId === null),
    );

    protected readonly myCharacterPublicIds = computed(() =>
        this.myCharacters
            .value()
            .filter((character) => character.guildPublicId === this.publicId())
            .map((character) => character.publicId),
    );

    /** Nothing to apply with once one of the visitor's characters is already in the roster. */
    protected readonly canApply = computed(
        () => this.membership.hasSheet() && !this.store.isMember() && this.store.sheet() !== null,
    );

    private readonly characters = inject(CharactersService);
    private readonly router = inject(Router);

    public async ngOnInit(): Promise<void> {
        await this.store.load(this.publicId());
    }

    protected onSave(request: GuildUpdateRequestDto): void {
        void this.store.updateProfile(request);
    }

    protected onSetRank(change: RankChange): void {
        void this.store.setRank(change.characterPublicId, change.rank);
    }

    protected onKick(characterPublicId: string): void {
        void this.store.kick(characterPublicId);
    }

    protected onTransfer(characterPublicId: string): void {
        void this.store.transferLeadership(characterPublicId);
    }

    protected async onLeave(characterPublicId: string): Promise<void> {
        if (await this.store.leave(characterPublicId)) {
            this.myCharacters.reload();
        }
    }

    protected async onApply(draft: GuildApplicationDraft): Promise<void> {
        await this.store.apply(draft.characterPublicId, draft.message);
    }

    protected onWithdraw(): void {
        void this.store.withdrawApplication();
    }

    /** The sheet no longer exists once disbanded, so the visitor lands back on the directory. */
    protected async onDisband(confirmation: string): Promise<void> {
        if (await this.store.disband(confirmation)) {
            await this.router.navigate([`${WOW_GAME_URL}/guilds`]);
        }
    }

    /** An accepted application adds a member, so the roster and the characters must be re-read. */
    protected async onRosterChanged(): Promise<void> {
        await this.store.refresh();
        this.myCharacters.reload();
    }
}
