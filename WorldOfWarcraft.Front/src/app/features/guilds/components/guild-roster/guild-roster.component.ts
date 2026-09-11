import { Component, computed, input, output } from "@angular/core";
import { RouterLink } from "@angular/router";
import { SkeletonComponent } from "@bari77/gc-ui";
import {
    GUILD_RANK_LEADER,
    GUILD_RANK_MEMBER,
    GUILD_RANK_OFFICER,
    GuildMember,
    guildRankWeight,
} from "@features/guilds/models/guild.model";
import { NbButtonModule, NbCardModule } from "@nebular/theme";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";

export interface RankChange {
    characterPublicId: string;
    rank: string;
}

@Component({
    standalone: true,
    selector: "wow-guild-roster",
    imports: [RouterLink, GameTermPipe, NbButtonModule, NbCardModule, SkeletonComponent],
    templateUrl: "./guild-roster.component.html",
    styleUrl: "./guild-roster.component.scss",
})
export class GuildRosterComponent {
    public readonly members = input.required<GuildMember[]>();
    public readonly memberCount = input(0);
    public readonly viewerRank = input<string | null>(null);
    public readonly loading = input(false);
    public readonly busy = input(false);

    /** Public ids of the visitor's own characters, the ones they may make leave the guild. */
    public readonly myCharacterPublicIds = input<string[]>([]);

    public readonly setRank = output<RankChange>();
    public readonly kick = output<string>();
    public readonly transfer = output<string>();
    public readonly leave = output<string>();

    protected readonly contactTitle = $localize`:@@wow.guild.roster.contact:Open the player profile to send a friend request`;

    protected readonly memberPlaceholders = [0, 1, 2, 3];
    protected readonly rankOfficer = GUILD_RANK_OFFICER;
    protected readonly rankMember = GUILD_RANK_MEMBER;

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

    protected canPromote(member: GuildMember): boolean {
        return this.isLeader() && member.rank === GUILD_RANK_MEMBER;
    }

    protected canDemote(member: GuildMember): boolean {
        return this.isLeader() && member.rank === GUILD_RANK_OFFICER;
    }

    protected canTransfer(member: GuildMember): boolean {
        return this.isLeader() && !member.isLeader();
    }

    protected canLeave(member: GuildMember): boolean {
        return this.isMine(member) && !member.isLeader();
    }
}
