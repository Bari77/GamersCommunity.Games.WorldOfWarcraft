export interface GuildCrestDto {
    emblem: number;
    emblemColor: string;
    border: number;
    borderColor: string;
    backgroundColor: string;
    faction?: string | null;
}

/** Neutral tabard, matching the SQL defaults so a guild always has something to wear. */
const DEFAULT_CREST: GuildCrestDto = {
    emblem: 0,
    emblemColor: "#f0e6c8",
    border: 0,
    borderColor: "#c8a95a",
    backgroundColor: "#1e2a4a",
    faction: null,
};

/** Highest part shipped in public/wow-crests, kept in step with the scraping script. */
export const CREST_EMBLEM_COUNT = 196;
export const CREST_BORDER_COUNT = 7;

export class GuildCrest {
    public constructor(
        public emblem: number,
        public emblemColor: string,
        public border: number,
        public borderColor: string,
        public backgroundColor: string,
        public faction: string | null,
    ) {}

    public static fromDto(dto: GuildCrestDto | null | undefined): GuildCrest {
        const source = dto ?? DEFAULT_CREST;
        return new GuildCrest(
            source.emblem ?? DEFAULT_CREST.emblem,
            source.emblemColor || DEFAULT_CREST.emblemColor,
            source.border ?? DEFAULT_CREST.border,
            source.borderColor || DEFAULT_CREST.borderColor,
            source.backgroundColor || DEFAULT_CREST.backgroundColor,
            source.faction ?? null,
        );
    }

    public toDto(): GuildCrestDto {
        return {
            emblem: this.emblem,
            emblemColor: this.emblemColor,
            border: this.border,
            borderColor: this.borderColor,
            backgroundColor: this.backgroundColor,
            faction: this.faction,
        };
    }

    public with(changes: Partial<GuildCrestDto>): GuildCrest {
        return GuildCrest.fromDto({ ...this.toDto(), ...changes });
    }
}
