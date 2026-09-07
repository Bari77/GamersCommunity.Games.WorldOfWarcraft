import { Injectable } from "@angular/core";
import { GuildSheetDto } from "@features/guilds/dto/guild.dto";
import { GuildSheet } from "@features/guilds/models/guild.model";
import { BaseService } from "@shared/services/base.service";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class GuildSheetService extends BaseService {
    public constructor() {
        super("/worldofwarcraft/Guilds");
    }

    public getByPublicId(publicId: string): Observable<GuildSheet> {
        return this.getOne<GuildSheetDto, GuildSheet>(GuildSheet, publicId);
    }
}
