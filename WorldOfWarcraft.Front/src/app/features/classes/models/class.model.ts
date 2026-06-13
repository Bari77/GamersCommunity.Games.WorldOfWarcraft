import { ClassDto } from "../dto/class.dto";

export class WowClass {
    public constructor(
        public id: number,
        public creationDate: Date,
        public modificationDate: Date,
        public entitled: string,
    ) {}

    public static fromDto(dto: ClassDto): WowClass {
        return new WowClass(
            dto.id,
            new Date(dto.creationDate),
            new Date(dto.modificationDate),
            dto.entitled,
        );
    }
}
