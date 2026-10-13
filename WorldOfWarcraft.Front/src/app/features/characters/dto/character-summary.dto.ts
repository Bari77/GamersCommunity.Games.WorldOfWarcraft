export interface CharacterSummaryDto {
    publicId: string;
    pseudo: string;
    level: number;
    ilvl: number;
    main: boolean;
    creationDate: string;
    playerPublicId: string;
    serverName: string;
    raceName: string;
    className?: string | null;
    mainSpecializationName?: string | null;
    guildPublicId?: string | null;
    guildName?: string | null;
    guildDiscriminator?: string | null;
}
