import { Component, computed, input, output, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { DecisionPromptComponent, SkeletonComponent } from "@bari77/gc-ui";
import {
    GUILD_RANK_LEADER,
    GUILD_RANK_MEMBER,
    GUILD_RANK_OFFICER,
    GuildMember,
    guildRankWeight,
} from "@features/guilds/models/guild.model";
import { NbSelectModule } from "@nebular/theme";
import { WowIconComponent } from "@shared/components/wow-icon/wow-icon.component";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";

export interface RankChange {
    characterPublicId: string;
    rank: string;
}

const ACTION_REMOVE = "__remove__";
const ACTION_LEAVE = "__leave__";

type RankOption = { value: string; label: string };

type PendingAction = {
    characterPublicId: string;
    value: string;
    heading: string;
    message: string;
    primaryLabel: string;
};

@Component({
    standalone: true,
    selector: "wow-guild-roster",
    imports: [RouterLink, GameTermPipe, NbSelectModule, SkeletonComponent, WowIconComponent, DecisionPromptComponent],
    templateUrl: "./guild-roster.component.html",
    styleUrl: "./guild-roster.component.scss",
})
export class GuildRosterComponent {
    public readonly members = input.required<GuildMember[]>();
    public readonly viewerRank = input<string | null>(null);
    public readonly loading = input(false);
    public readonly busy = input(false);

    /**
     * The layout editor has no router. Turning this off keeps the handle visible without
     * exploding the card on a missing `Router` provider.
     */
    public readonly navigable = input(true);

    /** Public ids of the visitor's own characters, the ones they may make leave the guild. */
    public readonly myCharacterPublicIds = input<string[]>([]);

    public readonly setRank = output<RankChange>();
    public readonly kick = output<string>();
    public readonly transfer = output<string>();
    public readonly leave = output<string>();

    protected readonly contactTitle = $localize`:@@wow.guild.roster.contact:Open the player profile to send a friend request`;
    protected readonly rankFieldName = $localize`:@@wow.guild.roster.rank:Rank`;
    protected readonly cancelLabel = $localize`:@@wow.guild.roster.cancel:Cancel`;

    protected readonly memberPlaceholders = [0, 1, 2, 3];
    protected readonly pending = signal<PendingAction | null>(null);

    protected readonly isLeader = computed(() => this.viewerRank() === GUILD_RANK_LEADER);
    protected readonly canModerate = computed(
        () => guildRankWeight(this.viewerRank()) >= guildRankWeight(GUILD_RANK_OFFICER),
    );

    protected isMine(member: GuildMember): boolean {
        return this.myCharacterPublicIds().includes(member.characterPublicId);
    }

    /** Officers only act on strictly lower ranks, which mirrors the microservice guard. */
    protected canKick(member: GuildMember): boolean {
        return (
            this.canModerate() &&
            !this.isMine(member) &&
            guildRankWeight(member.rank) < guildRankWeight(this.viewerRank())
        );
    }

    protected canSetRank(member: GuildMember, rank: string): boolean {
        return this.isLeader() && !member.isLeader() && member.rank !== rank && rank !== GUILD_RANK_LEADER;
    }

    protected canTransfer(member: GuildMember): boolean {
        return this.isLeader() && !member.isLeader();
    }

    protected canLeave(member: GuildMember): boolean {
        return this.isMine(member) && !member.isLeader();
    }

    protected rankOptions(member: GuildMember): RankOption[] {
        const options: RankOption[] = [{ value: member.rank, label: this.rankLabel(member.rank) }];

        for (const rank of [GUILD_RANK_MEMBER, GUILD_RANK_OFFICER]) {
            if (this.canSetRank(member, rank)) {
                options.push({ value: rank, label: this.rankLabel(rank) });
            }
        }

        if (this.canTransfer(member)) {
            options.push({
                value: GUILD_RANK_LEADER,
                label: $localize`:@@wow.guild.roster.transfer:Make leader`,
            });
        }

        if (this.canKick(member)) {
            options.push({
                value: ACTION_REMOVE,
                label: $localize`:@@wow.guild.roster.kick:Remove`,
            });
        }

        if (this.canLeave(member)) {
            options.push({
                value: ACTION_LEAVE,
                label: $localize`:@@wow.guild.roster.leave:Leave`,
            });
        }

        return options;
    }

    /** Keeps the card free of an empty footer for the visitors who may do nothing. */
    protected hasActions(member: GuildMember): boolean {
        return this.rankOptions(member).length > 1;
    }

    protected selectValue(member: GuildMember): string {
        const pending = this.pending();
        if (pending?.characterPublicId === member.characterPublicId) {
            return pending.value;
        }
        return member.rank;
    }

    protected onRankSelect(member: GuildMember, value: string | null): void {
        if (!value || value === member.rank) {
            this.pending.set(null);
            return;
        }

        const name = member.pseudo;
        if (value === ACTION_REMOVE) {
            this.pending.set({
                characterPublicId: member.characterPublicId,
                value,
                heading: $localize`:@@wow.guild.roster.confirm.remove.heading:Remove member?`,
                message: $localize`:@@wow.guild.roster.confirm.remove.message:Remove ${name}:name: from the guild?`,
                primaryLabel: $localize`:@@wow.guild.roster.kick:Remove`,
            });
            return;
        }

        if (value === ACTION_LEAVE) {
            this.pending.set({
                characterPublicId: member.characterPublicId,
                value,
                heading: $localize`:@@wow.guild.roster.confirm.leave.heading:Leave guild?`,
                message: $localize`:@@wow.guild.roster.confirm.leave.message:Leave this guild with ${name}:name:?`,
                primaryLabel: $localize`:@@wow.guild.roster.leave:Leave`,
            });
            return;
        }

        if (value === GUILD_RANK_LEADER) {
            this.pending.set({
                characterPublicId: member.characterPublicId,
                value,
                heading: $localize`:@@wow.guild.roster.confirm.transfer.heading:Transfer leadership?`,
                message: $localize`:@@wow.guild.roster.confirm.transfer.message:Make ${name}:name: the new guild leader? You will become an officer.`,
                primaryLabel: $localize`:@@wow.guild.roster.transfer:Make leader`,
            });
            return;
        }

        const rank = this.rankLabel(value);
        this.pending.set({
            characterPublicId: member.characterPublicId,
            value,
            heading: $localize`:@@wow.guild.roster.confirm.rank.heading:Change rank?`,
            message: $localize`:@@wow.guild.roster.confirm.rank.message:Set ${name}:name: to ${rank}:rank:?`,
            primaryLabel: $localize`:@@wow.guild.roster.confirm.rank.action:Change rank`,
        });
    }

    protected confirmPending(): void {
        const pending = this.pending();
        if (!pending) {
            return;
        }

        const { characterPublicId, value } = pending;
        this.pending.set(null);

        if (value === ACTION_REMOVE) {
            this.kick.emit(characterPublicId);
            return;
        }
        if (value === ACTION_LEAVE) {
            this.leave.emit(characterPublicId);
            return;
        }
        if (value === GUILD_RANK_LEADER) {
            this.transfer.emit(characterPublicId);
            return;
        }
        this.setRank.emit({ characterPublicId, rank: value });
    }

    protected cancelPending(): void {
        this.pending.set(null);
    }

    private rankLabel(rank: string): string {
        switch (rank) {
            case GUILD_RANK_LEADER:
                return $localize`:@@wow.guild.rank.leader:Leader`;
            case GUILD_RANK_OFFICER:
                return $localize`:@@wow.guild.rank.officer:Officer`;
            case GUILD_RANK_MEMBER:
                return $localize`:@@wow.guild.rank.member:Member`;
            default:
                return rank;
        }
    }
}
