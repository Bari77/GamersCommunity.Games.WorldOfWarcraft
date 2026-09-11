import { Injectable } from "@angular/core";
import {
    GuildApplicationCreateRequestDto,
    GuildApplicationDto,
    GuildApplicationListRequestDto,
    GuildApplicationReviewRequestDto,
    GuildApplicationTargetRequestDto,
} from "@features/guilds/dto/guild-application.dto";
import { GuildApplication } from "@features/guilds/models/guild-application.model";
import { BaseService } from "@shared/services/base.service";
import { map, Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class GuildApplicationsService extends BaseService {
    public constructor() {
        super("/worldofwarcraft/GuildApplications");
    }

    public create(request: GuildApplicationCreateRequestDto): Observable<GuildApplication> {
        return this.post<GuildApplicationDto, GuildApplication>(GuildApplication, "actions/Create", request);
    }

    /** Applications sent by the current player, whatever their status. */
    public listMine(): Observable<GuildApplication[]> {
        return this.listAt("actions/ListMine", {});
    }

    /** Review queue of a guild, reserved to its leader and officers. */
    public listForGuild(request: GuildApplicationListRequestDto): Observable<GuildApplication[]> {
        return this.listAt("actions/List", request);
    }

    public review(request: GuildApplicationReviewRequestDto): Observable<GuildApplication> {
        return this.post<GuildApplicationDto, GuildApplication>(GuildApplication, "actions/Review", request);
    }

    public withdraw(request: GuildApplicationTargetRequestDto): Observable<GuildApplication> {
        return this.post<GuildApplicationDto, GuildApplication>(GuildApplication, "actions/Withdraw", request);
    }

    private listAt(action: string, payload: object): Observable<GuildApplication[]> {
        return this.http
            .post<GuildApplicationDto[]>(this.getURL(action), payload)
            .pipe(map((dtos) => dtos.map((dto) => GuildApplication.fromDto(dto))));
    }
}
