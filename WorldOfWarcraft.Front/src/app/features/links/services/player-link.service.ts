import { Injectable } from "@angular/core";
import {
    PlayerLinkCreateRequestDto,
    PlayerLinkDto,
    PlayerLinkListRequestDto,
    PlayerLinkReorderRequestDto,
    PlayerLinkUpdateRequestDto,
} from "@features/links/dto/player-link.dto";
import { PlayerLink } from "@features/links/models/player-link.model";
import { BaseService } from "@shared/services/base.service";
import { map, Observable } from "rxjs";

const RESOURCE = "PlayerLinks";

@Injectable({ providedIn: "root" })
export class PlayerLinkService extends BaseService {
    public constructor() {
        super("/worldofwarcraft");
    }

    public list(playerPublicId: string): Observable<PlayerLink[]> {
        const payload: PlayerLinkListRequestDto = { playerPublicId };
        return this.http
            .post<PlayerLinkDto[]>(this.getURL(`${RESOURCE}/actions/List`), payload)
            .pipe(map((dtos) => dtos.map((dto) => PlayerLink.fromDto(dto))));
    }

    public create(data: PlayerLinkCreateRequestDto): Observable<PlayerLink> {
        return this.http
            .post<PlayerLinkDto>(this.getURL(`${RESOURCE}/actions/Create`), data)
            .pipe(map((dto) => PlayerLink.fromDto(dto)));
    }

    public update(publicId: string, data: PlayerLinkUpdateRequestDto): Observable<PlayerLink> {
        return this.http
            .put<PlayerLinkDto>(this.getURL(`${RESOURCE}/${publicId}`), data)
            .pipe(map((dto) => PlayerLink.fromDto(dto)));
    }

    public remove(publicId: string): Observable<void> {
        return this.http.delete<void>(this.getURL(`${RESOURCE}/${publicId}`));
    }

    public reorder(publicIds: string[]): Observable<PlayerLink[]> {
        const payload: PlayerLinkReorderRequestDto = { publicIds };
        return this.http
            .post<PlayerLinkDto[]>(this.getURL(`${RESOURCE}/actions/Reorder`), payload)
            .pipe(map((dtos) => dtos.map((dto) => PlayerLink.fromDto(dto))));
    }
}
