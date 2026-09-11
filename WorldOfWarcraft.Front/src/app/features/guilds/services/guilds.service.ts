import { Injectable } from "@angular/core";
import {
    GuildCreateRequestDto,
    GuildDisbandRequestDto,
    GuildDisbandResultDto,
    GuildLeaveResultDto,
    GuildMemberTargetRequestDto,
    GuildSearchRequestDto,
    GuildSearchResultDto,
    GuildSetRankRequestDto,
    GuildSheetDto,
    GuildUpdateRequestDto,
} from "@features/guilds/dto/guild.dto";
import { GuildSheet, GuildSummary } from "@features/guilds/models/guild.model";
import { BaseService } from "@shared/services/base.service";
import { map, Observable } from "rxjs";

export interface GuildSearchPage {
    items: GuildSummary[];
    hasMore: boolean;
}

@Injectable({ providedIn: "root" })
export class GuildsService extends BaseService {
    public constructor() {
        super("/worldofwarcraft/Guilds");
    }

    public getByPublicId(publicId: string): Observable<GuildSheet> {
        return this.getOne<GuildSheetDto, GuildSheet>(GuildSheet, publicId);
    }

    public search(request: GuildSearchRequestDto): Observable<GuildSearchPage> {
        return this.http.post<GuildSearchResultDto>(this.getURL("actions/Search"), request).pipe(
            map((dto) => ({
                items: (dto.items ?? []).map((item) => GuildSummary.fromDto(item)),
                hasMore: dto.hasMore ?? false,
            })),
        );
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

    public leave(request: GuildMemberTargetRequestDto): Observable<GuildLeaveResultDto> {
        return this.http.post<GuildLeaveResultDto>(this.getURL("actions/Leave"), request);
    }

    public disband(request: GuildDisbandRequestDto): Observable<GuildDisbandResultDto> {
        return this.http.post<GuildDisbandResultDto>(this.getURL("actions/Disband"), request);
    }
}
