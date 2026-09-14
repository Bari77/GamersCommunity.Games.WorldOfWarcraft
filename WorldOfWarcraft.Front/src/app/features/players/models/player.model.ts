import {
    PlayerGuildDto,
    PlayerResolveResultDto,
    PlayerSheetDto,
    PlayerSummaryDto,
} from "@features/players/dto/player.dto";
import { GuildCrest } from "@shared/models/guild-crest";

export class PlayerGuild {
    public constructor(
        public publicId: string,
        public entitled: string,
        public discriminator: string,
        public rank: string,
        public crest: GuildCrest,
    ) {}

    public static fromDto(dto: PlayerGuildDto): PlayerGuild {
        return new PlayerGuild(
            dto.publicId,
            dto.entitled,
            dto.discriminator,
            dto.rank,
            GuildCrest.fromDto(dto.crest),
        );
    }

    public get handle(): string {
        return `${this.entitled}#${this.discriminator}`;
    }
}

export class PlayerSheet {
    public constructor(
        public publicId: string,
        public platformUserPublicId: string,
        public nickname: string,
        public discriminator: string,
        public avatarUrl: string,
        public presentationIrl: string | null,
        public presentationIg: string | null,
        public nbMount: number,
        public successPoints: number | null,
        public creationDate: Date,
        public characterCount: number,
        public layoutJson: string | null,
        public guild: PlayerGuild | null,
    ) {}

    public get handle(): string {
        return this.discriminator ? `${this.nickname}#${this.discriminator}` : this.nickname;
    }

    public static fromDto(dto: PlayerSheetDto): PlayerSheet {
        return new PlayerSheet(
            dto.publicId,
            dto.platformUserPublicId,
            dto.nickname,
            dto.discriminator,
            dto.avatarUrl,
            // `?? null` throughout: the API omits its null properties, so they arrive undefined
            // and would slip past a `=== null` test.
            dto.presentationIrl ?? null,
            dto.presentationIg ?? null,
            dto.nbMount,
            dto.successPoints ?? null,
            new Date(dto.creationDate),
            dto.characterCount,
            dto.layoutJson ?? null,
            dto.guild ? PlayerGuild.fromDto(dto.guild) : null,
        );
    }
}

export class PlayerSummary {
    public constructor(
        public publicId: string,
        public platformUserPublicId: string,
        public nickname: string,
        public discriminator: string,
        public avatarUrl: string,
        public presentationIrl: string | null,
        public creationDate: Date,
        public characterCount: number,
    ) {}

    public static fromDto(dto: PlayerSummaryDto): PlayerSummary {
        return new PlayerSummary(
            dto.publicId,
            dto.platformUserPublicId,
            dto.nickname,
            dto.discriminator,
            dto.avatarUrl,
            dto.presentationIrl ?? null,
            new Date(dto.creationDate),
            dto.characterCount ?? 0,
        );
    }

    public handleLabel(): string {
        return `${this.nickname}#${this.discriminator}`;
    }

    public initials(): string {
        return this.nickname.charAt(0) || "?";
    }
}

export class PlayerResolveResult {
    public constructor(
        public playerPublicId: string | null,
        public hasSheet: boolean,
    ) {}

    public static fromDto(dto: PlayerResolveResultDto): PlayerResolveResult {
        return new PlayerResolveResult(dto.playerPublicId ?? null, dto.hasSheet);
    }
}
