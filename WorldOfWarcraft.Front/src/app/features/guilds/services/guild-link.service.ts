import { Injectable } from "@angular/core";
import {
    GuildLinkCreateRequestDto,
    GuildLinkListRequestDto,
    GuildLinkReorderRequestDto,
    GuildLinkUpdateRequestDto,
} from "@features/guilds/dto/guild-link.dto";
import { GuildLink } from "@features/guilds/models/guild-link.model";
import { BaseService } from "@shared/services/base.service";
import { Observable } from "rxjs";

const RESOURCE = "GuildLinks";

@Injectable()
export class GuildLinkService extends BaseService {
    public constructor() {
        super("/worldofwarcraft");
    }

    public list(guildPublicId: string): Observable<GuildLink[]> {
        const payload: GuildLinkListRequestDto = { guildPublicId };
        return this.postList(GuildLink, `${RESOURCE}/actions/List`, payload);
    }

    public create(data: GuildLinkCreateRequestDto): Observable<GuildLink> {
        return this.post(GuildLink, `${RESOURCE}/actions/Create`, data);
    }

    public update(publicId: string, data: GuildLinkUpdateRequestDto): Observable<GuildLink> {
        return this.put(GuildLink, `${RESOURCE}/${publicId}`, data);
    }

    public remove(publicId: string): Observable<void> {
        return this.delete(`${RESOURCE}/${publicId}`);
    }

    public reorder(guildPublicId: string, publicIds: string[]): Observable<GuildLink[]> {
        const payload: GuildLinkReorderRequestDto = { guildPublicId, publicIds };
        return this.postList(GuildLink, `${RESOURCE}/actions/Reorder`, payload);
    }
}
