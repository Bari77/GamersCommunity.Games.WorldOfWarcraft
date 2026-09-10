import {
    CharacterSummaryDto,
    GuildSummaryDto,
    HomeFeedDto,
    LfgAdSummaryDto,
    PlayerSummaryDto,
} from "@features/home/dto/home-feed.dto";
import { classColor } from "@features/characters/models/class-colors";
import { roleLabel, specKey, specRole, WowRole } from "@features/characters/models/spec-roles";
import { WowIconKind } from "@shared/components/wow-icon/wow-icon.component";

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
        public ilvl: number,
        public main: boolean,
        public creationDate: Date,
        public playerPublicId: string,
        public serverName: string,
        public raceName: string,
        public className: string | null,
        public mainSpecializationName: string | null,
        public guildPublicId: string | null,
        public guildName: string | null,
        public guildDiscriminator: string | null,
    ) {}

    public static fromDto(dto: CharacterSummaryDto): CharacterSummary {
        return new CharacterSummary(
            dto.publicId,
            dto.pseudo,
            dto.level,
            dto.ilvl,
            dto.main,
            new Date(dto.creationDate),
            dto.playerPublicId,
            dto.serverName,
            dto.raceName,
            dto.className,
            dto.mainSpecializationName,
            dto.guildPublicId,
            dto.guildName,
            dto.guildDiscriminator,
        );
    }

    public get color(): string {
        return classColor(this.className);
    }

    public get guildHandle(): string | null {
        return this.guildName ? `${this.guildName}#${this.guildDiscriminator}` : null;
    }

    /** Specless characters still deserve a crest, so fall back to the class emblem. */
    public emblem(): { kind: WowIconKind; slug: string | null } {
        const key = this.specKey();
        return key ? { kind: "spec", slug: key } : { kind: "class", slug: this.className };
    }

    public specKey(): string | null {
        return specKey(this.className, this.mainSpecializationName);
    }

    public role(): WowRole | null {
        return specRole(this.specKey());
    }

    public roleName(): string {
        const role = this.role();
        return role ? roleLabel(role) : "";
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
