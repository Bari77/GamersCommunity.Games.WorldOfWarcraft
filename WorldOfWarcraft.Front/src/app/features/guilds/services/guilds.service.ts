import { Injectable } from "@angular/core";
import {
    GuildCreateRequestDto,
    GuildDisbandRequestDto,
    GuildMemberTargetRequestDto,
    GuildSearchRequestDto,
    GuildSetRankRequestDto,
    GuildSheetDto,
    GuildUpdateRequestDto,
} from "@features/guilds/dto/guild.dto";
import {
    GuildDisbandResult,
    GuildLeaveResult,
    GuildSearchPage,
    GuildSheet,
} from "@features/guilds/models/guild.model";
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
