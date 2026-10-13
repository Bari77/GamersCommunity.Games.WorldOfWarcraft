import { Injectable } from "@angular/core";
import { GuildApplicationDto } from "@features/guilds/dto/guild-application.dto";
import { GuildApplicationTargetRequestDto } from "@features/guilds/dto/guild-application-target-request.dto";
import { GuildApplicationReviewRequestDto } from "@features/guilds/dto/guild-application-review-request.dto";
import { GuildApplicationListRequestDto } from "@features/guilds/dto/guild-application-list-request.dto";
import { GuildApplicationCreateRequestDto } from "@features/guilds/dto/guild-application-create-request.dto";
import { GuildApplication } from "@features/guilds/models/guild-application.model";
import { BaseService } from "@shared/services/base.service";
import { Observable } from "rxjs";

@Injectable()
export class GuildApplicationsService extends BaseService {
    public constructor() {
        super("/worldofwarcraft/GuildApplications");
    }

    public create(request: GuildApplicationCreateRequestDto): Observable<GuildApplication> {
        return this.post<GuildApplicationDto, GuildApplication>(GuildApplication, "actions/Create", request);
    }

    /** Applications sent by the current player, whatever their status. */
    public listMine(): Observable<GuildApplication[]> {
        return this.postList(GuildApplication, "actions/ListMine", {});
    }

    /** Review queue of a guild, reserved to its leader and officers. */
    public listForGuild(request: GuildApplicationListRequestDto): Observable<GuildApplication[]> {
        return this.postList(GuildApplication, "actions/List", request);
    }

    public review(request: GuildApplicationReviewRequestDto): Observable<GuildApplication> {
        return this.post<GuildApplicationDto, GuildApplication>(GuildApplication, "actions/Review", request);
    }

    public withdraw(request: GuildApplicationTargetRequestDto): Observable<GuildApplication> {
        return this.post<GuildApplicationDto, GuildApplication>(GuildApplication, "actions/Withdraw", request);
    }
}
