import { Injectable } from "@angular/core";
import {
    GuildLinkCreateRequestDto,
    GuildLinkDto,
    GuildLinkListRequestDto,
    GuildLinkReorderRequestDto,
    GuildLinkUpdateRequestDto,
} from "@features/guilds/dto/guild-link.dto";
import { GuildLink } from "@features/guilds/models/guild-link.model";
import { BaseService } from "@shared/services/base.service";
import { map, Observable } from "rxjs";

const RESOURCE = "GuildLinks";

@Injectable()
export class GuildLinkService extends BaseService {
    public constructor() {
        super("/worldofwarcraft");
    }

    public list(guildPublicId: string): Observable<GuildLink[]> {
        const payload: GuildLinkListRequestDto = { guildPublicId };
        return this.http
            .post<GuildLinkDto[]>(this.getURL(`${RESOURCE}/actions/List`), payload)
            .pipe(map((dtos) => dtos.map((dto) => GuildLink.fromDto(dto))));
    }

    public create(data: GuildLinkCreateRequestDto): Observable<GuildLink> {
        return this.http
            .post<GuildLinkDto>(this.getURL(`${RESOURCE}/actions/Create`), data)
            .pipe(map((dto) => GuildLink.fromDto(dto)));
    }

    public update(publicId: string, data: GuildLinkUpdateRequestDto): Observable<GuildLink> {
        return this.http
            .put<GuildLinkDto>(this.getURL(`${RESOURCE}/${publicId}`), data)
            .pipe(map((dto) => GuildLink.fromDto(dto)));
    }

    public remove(publicId: string): Observable<void> {
        return this.http.delete<void>(this.getURL(`${RESOURCE}/${publicId}`));
    }

    public reorder(guildPublicId: string, publicIds: string[]): Observable<GuildLink[]> {
        const payload: GuildLinkReorderRequestDto = { guildPublicId, publicIds };
        return this.http
            .post<GuildLinkDto[]>(this.getURL(`${RESOURCE}/actions/Reorder`), payload)
            .pipe(map((dtos) => dtos.map((dto) => GuildLink.fromDto(dto))));
    }
}
