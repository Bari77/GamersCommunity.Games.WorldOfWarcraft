import { Injectable } from "@angular/core";
import { ClassDto } from "@features/classes/dto/class.dto";
import { WowClass } from "@features/classes/models/class.model";
import { BaseService } from "@shared/services/base.service";
import { Observable } from "rxjs";

@Injectable()
export class ClassesService extends BaseService {
    public constructor() {
        super("/worldofwarcraft/Classes");
    }

    public list(): Observable<WowClass[]> {
        return this.getAll<ClassDto, WowClass>(WowClass);
    }
}
