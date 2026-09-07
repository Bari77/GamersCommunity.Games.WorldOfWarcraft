import {
    CharacterSummaryDto,
    GuildSummaryDto,
    HomeFeedDto,
    LfgAdSummaryDto,
    PlayerSummaryDto,
} from "@features/home/dto/home-feed.dto";

export class LfgAdSummary {
    public constructor(
        public publicId: string,
        public body: string,
        public senderNickname: string,
        public senderDiscriminator: string,
        public creationDate: Date,
        public expiresAt: Date,
        public playerPublicId: string,
        public platformUserPublicId: string,
    ) {}

    public static fromDto(dto: LfgAdSummaryDto): LfgAdSummary {
        return new LfgAdSummary(
            dto.publicId,
            dto.body,
            dto.senderNickname,
            dto.senderDiscriminator,
            new Date(dto.creationDate),
            new Date(dto.expiresAt),
            dto.playerPublicId,
            dto.platformUserPublicId,
        );
    }
}

export class CharacterSummary {
    public constructor(
        public publicId: string,
        public pseudo: string,
        public level: number,
        public main: boolean,
        public creationDate: Date,
        public playerPublicId: string,
        public serverName: string,
        public raceName: string,
    ) {}

    public static fromDto(dto: CharacterSummaryDto): CharacterSummary {
        return new CharacterSummary(
            dto.publicId,
            dto.pseudo,
            dto.level,
            dto.main,
            new Date(dto.creationDate),
            dto.playerPublicId,
            dto.serverName,
            dto.raceName,
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
    ) {}

    public static fromDto(dto: PlayerSummaryDto): PlayerSummary {
        return new PlayerSummary(
            dto.publicId,
            dto.platformUserPublicId,
            dto.nickname,
            dto.discriminator,
            dto.avatarUrl,
            dto.presentationIrl,
            new Date(dto.creationDate),
        );
    }

    public handleLabel(): string {
        return `${this.nickname}#${this.discriminator}`;
    }

    public initials(): string {
        return this.nickname.charAt(0) || "?";
    }
}

export class GuildSummary {
    public constructor(
        public publicId: string,
        public entitled: string,
        public discriminator: string,
        public level: number,
        public creationDate: Date,
        public serverName: string,
        public memberCount: number,
    ) {}

    public static fromDto(dto: GuildSummaryDto): GuildSummary {
        return new GuildSummary(
            dto.publicId,
            dto.entitled,
            dto.discriminator,
            dto.level,
            new Date(dto.creationDate),
            dto.serverName,
            dto.memberCount,
        );
    }

    public handleLabel(): string {
        return `${this.entitled}#${this.discriminator}`;
    }
}

export class HomeFeed {
    public constructor(
        public latestLfg: LfgAdSummary[],
        public latestCharacters: CharacterSummary[],
        public latestPlayers: PlayerSummary[],
        public latestGuilds: GuildSummary[],
    ) {}

    public static fromDto(dto: HomeFeedDto): HomeFeed {
        return new HomeFeed(
            dto.latestLfg.map((item) => LfgAdSummary.fromDto(item)),
            dto.latestCharacters.map((item) => CharacterSummary.fromDto(item)),
            dto.latestPlayers.map((item) => PlayerSummary.fromDto(item)),
            dto.latestGuilds.map((item) => GuildSummary.fromDto(item)),
        );
    }
}
