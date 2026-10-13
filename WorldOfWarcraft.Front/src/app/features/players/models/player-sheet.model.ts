import { PlayerSheetDto } from "@features/players/dto/player-sheet.dto";
import { PlayerGuild } from "./player.model";

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
