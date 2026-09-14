import { POST_VISIBILITY_PUBLIC } from "@features/guilds/models/game-post.model";
import { GUILD_RANK_LEADER, GUILD_RANK_MEMBER, GUILD_RANK_OFFICER } from "@features/guilds/models/guild.model";

export interface PostVisibilityOption {
    value: string;
    label: string;
}

/** Audiences a post can be published to, from the widest to the narrowest. */
export const POST_VISIBILITY_OPTIONS: readonly PostVisibilityOption[] = [
    { value: POST_VISIBILITY_PUBLIC, label: $localize`:@@wow.guild.wall.visibility.public:Public` },
    { value: GUILD_RANK_MEMBER, label: $localize`:@@wow.guild.wall.visibility.member:Members` },
    { value: GUILD_RANK_OFFICER, label: $localize`:@@wow.guild.wall.visibility.officer:Officers` },
    { value: GUILD_RANK_LEADER, label: $localize`:@@wow.guild.wall.visibility.leader:Leader only` },
];

export function postVisibilityLabel(visibility: string): string {
    return POST_VISIBILITY_OPTIONS.find((option) => option.value === visibility)?.label ?? visibility;
}
