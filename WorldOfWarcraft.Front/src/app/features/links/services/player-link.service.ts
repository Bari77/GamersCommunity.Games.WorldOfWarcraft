import { Injectable } from "@angular/core";
import { PlayerLinkUpdateRequestDto } from "@features/links/dto/player-link.dto";
import { PlayerLinkReorderRequestDto } from "@features/links/dto/player-link-reorder-request.dto";
import { PlayerLinkListRequestDto } from "@features/links/dto/player-link-list-request.dto";
import { PlayerLinkCreateRequestDto } from "@features/links/dto/player-link-create-request.dto";
import { PlayerLink } from "@features/links/models/player-link.model";
import { BaseService } from "@shared/services/base.service";
import { Observable } from "rxjs";

const RESOURCE = "PlayerLinks";

@Injectable()
export class PlayerLinkService extends BaseService {
    public constructor() {
        super("/worldofwarcraft");
    }

    public list(playerPublicId: string): Observable<PlayerLink[]> {
        const payload: PlayerLinkListRequestDto = { playerPublicId };
        return this.postList(PlayerLink, `${RESOURCE}/actions/List`, payload);
    }

    public create(data: PlayerLinkCreateRequestDto): Observable<PlayerLink> {
        return this.post(PlayerLink, `${RESOURCE}/actions/Create`, data);
    }

    public update(publicId: string, data: PlayerLinkUpdateRequestDto): Observable<PlayerLink> {
        return this.put(PlayerLink, `${RESOURCE}/${publicId}`, data);
    }

    public remove(publicId: string): Observable<void> {
        return this.delete(`${RESOURCE}/${publicId}`);
    }

    public reorder(publicIds: string[]): Observable<PlayerLink[]> {
        const payload: PlayerLinkReorderRequestDto = { publicIds };
        return this.postList(PlayerLink, `${RESOURCE}/actions/Reorder`, payload);
    }
}
