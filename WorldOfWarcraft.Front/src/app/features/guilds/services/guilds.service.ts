import { Injectable } from "@angular/core";
import { GuildUpdateRequestDto } from "@features/guilds/dto/guild-update-request.dto";
import { GuildSheetDto } from "@features/guilds/dto/guild-sheet.dto";
import { GuildSetRankRequestDto } from "@features/guilds/dto/guild-set-rank-request.dto";
import { GuildSearchRequestDto } from "@features/guilds/dto/guild-search-request.dto";
import { GuildMemberTargetRequestDto } from "@features/guilds/dto/guild-member-target-request.dto";
import { GuildDisbandRequestDto } from "@features/guilds/dto/guild-disband-request.dto";
import { GuildCreateRequestDto } from "@features/guilds/dto/guild-create-request.dto";
import { GuildSheet } from "@features/guilds/models/guild-sheet.model";
import { GuildSearchPage } from "@features/guilds/models/guild-search-page.model";
import { GuildLeaveResult } from "@features/guilds/models/guild-leave-result.model";
import { GuildDisbandResult } from "@features/guilds/models/guild-disband-result.model";
import { BaseService } from "@shared/services/base.service";
import { Observable } from "rxjs";

@Injectable()
export class GuildsService extends BaseService {
    public constructor() {
        super("/worldofwarcraft/Guilds");
    }

    public getByPublicId(publicId: string): Observable<GuildSheet> {
        return this.getOne<GuildSheetDto, GuildSheet>(GuildSheet, publicId);
    }

    public search(request: GuildSearchRequestDto): Observable<GuildSearchPage> {
        return this.post(GuildSearchPage, "actions/Search", request);
    }

    public create(request: GuildCreateRequestDto): Observable<GuildSheet> {
        return this.post<GuildSheetDto, GuildSheet>(GuildSheet, null, request);
    }

    public update(publicId: string, request: GuildUpdateRequestDto): Observable<GuildSheet> {
        return this.put<GuildSheetDto, GuildSheet>(GuildSheet, publicId, request);
    }

    public setRank(request: GuildSetRankRequestDto): Observable<GuildSheet> {
        return this.post<GuildSheetDto, GuildSheet>(GuildSheet, "actions/SetRank", request);
    }

    public kick(request: GuildMemberTargetRequestDto): Observable<GuildSheet> {
        return this.post<GuildSheetDto, GuildSheet>(GuildSheet, "actions/Kick", request);
    }

    public transferLeadership(request: GuildMemberTargetRequestDto): Observable<GuildSheet> {
        return this.post<GuildSheetDto, GuildSheet>(GuildSheet, "actions/TransferLeadership", request);
    }

    public leave(request: GuildMemberTargetRequestDto): Observable<GuildLeaveResult> {
        return this.post(GuildLeaveResult, "actions/Leave", request);
    }

    public disband(request: GuildDisbandRequestDto): Observable<GuildDisbandResult> {
        return this.post(GuildDisbandResult, "actions/Disband", request);
    }
}
