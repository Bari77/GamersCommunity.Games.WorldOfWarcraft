import { Injectable } from "@angular/core";
import {
    PlayerLoadRequestDto,
    PlayerResolveResultDto,
    PlayerSearchRequestDto,
    PlayerSearchResultDto,
    PlayerSheetDto,
    PlayerUpdateRequestDto,
} from "@features/players/dto/player.dto";
import { PlayerResolveResult, PlayerSheet, PlayerSummary } from "@features/players/models/player.model";
import { BaseService } from "@shared/services/base.service";
import { map, Observable } from "rxjs";

export interface PlayerSearchPage {
    items: PlayerSummary[];
    hasMore: boolean;
}

@Injectable({ providedIn: "root" })
export class PlayersService extends BaseService {
    public constructor() {
        super("/worldofwarcraft/Players");
    }

    public load(data: PlayerLoadRequestDto): Observable<PlayerSheet> {
        return this.post<PlayerSheetDto, PlayerSheet>(PlayerSheet, "actions/Load", data);
    }

    public getByPublicId(publicId: string): Observable<PlayerSheet> {
        return this.getOne<PlayerSheetDto, PlayerSheet>(PlayerSheet, publicId);
    }

    public search(request: PlayerSearchRequestDto): Observable<PlayerSearchPage> {
        return this.http.post<PlayerSearchResultDto>(this.getURL("actions/Search"), request).pipe(
            map((dto) => ({
                items: (dto.items ?? []).map((item) => PlayerSummary.fromDto(item)),
                hasMore: dto.hasMore ?? false,
            })),
        );
    }

    public resolve(platformUserPublicId: string): Observable<PlayerResolveResult> {
        return this.post<PlayerResolveResultDto, PlayerResolveResult>(PlayerResolveResult, "actions/Resolve", {
            platformUserPublicId,
        });
    }

    public update(publicId: string, data: PlayerUpdateRequestDto): Observable<PlayerSheet> {
        return this.put<PlayerSheetDto, PlayerSheet>(PlayerSheet, publicId, data);
    }
}
