import { CharacterSummaryDto } from "@features/characters/dto/character-summary.dto";
import { classColor } from "@features/characters/models/class-colors";
import { roleLabel, specKey, specRole, WowRole } from "@features/characters/models/spec-roles";
import { WowIconKind } from "@shared/components/wow-icon/wow-icon.component";

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

    public get color(): string {
        return classColor(this.className);
    }

    public get guildHandle(): string | null {
        return this.guildName ? `${this.guildName}#${this.guildDiscriminator}` : null;
    }

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
            dto.className ?? null,
            dto.mainSpecializationName ?? null,
            dto.guildPublicId ?? null,
            dto.guildName ?? null,
            dto.guildDiscriminator ?? null,
        );
    }

    public emblem(): { kind: WowIconKind; slug: string | null } {
        return { kind: "class", slug: this.className };
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
