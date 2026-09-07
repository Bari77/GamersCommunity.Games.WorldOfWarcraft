import { Injectable } from "@angular/core";
import {
    CreateLfgMessageRequestDto,
    ListLfgBeforeRequestDto,
    LfgMessageDto,
    PostableGuildDto,
} from "@features/lfg/dto/lfg-message.dto";
import { LfgKind, LfgMessage, PostableGuild } from "@features/lfg/models/lfg-message.model";
import { BaseService } from "@shared/services/base.service";
import { map, Observable } from "rxjs";

const PAGE_SIZE = 50;

@Injectable({ providedIn: "root" })
export class LfgChatService extends BaseService {
    public constructor() {
        super("/worldofwarcraft/LfgAds");
    }

    public listRecent(kind: LfgKind): Observable<LfgMessage[]> {
        return this.http
            .post<LfgMessageDto[]>(this.getURL("actions/ListRecent"), { kind })
            .pipe(map((dtos) => dtos.map((dto) => LfgMessage.fromDto(dto))));
    }

    public listBefore(kind: LfgKind, before: LfgMessage): Observable<LfgMessage[]> {
        const payload: ListLfgBeforeRequestDto = {
            kind,
            beforeCreationDate: before.creationDate.toISOString(),
            beforePublicId: before.publicId,
            take: PAGE_SIZE,
        };
        return this.http
            .post<LfgMessageDto[]>(this.getURL("actions/ListBefore"), payload)
            .pipe(map((dtos) => dtos.map((dto) => LfgMessage.fromDto(dto))));
    }

    public send(data: CreateLfgMessageRequestDto): Observable<LfgMessage> {
        return this.post<LfgMessageDto, LfgMessage>(LfgMessage, "actions/Create", data);
    }
}

@Injectable({ providedIn: "root" })
export class GuildsService extends BaseService {
    public constructor() {
        super("/worldofwarcraft/Guilds");
    }

    /** Guilds the current player may post for, i.e. where one of their characters is officer or above. */
    public listPostable(): Observable<PostableGuild[]> {
        return this.http
            .post<PostableGuildDto[]>(this.getURL("actions/ListPostable"), {})
            .pipe(map((dtos) => dtos.map((dto) => PostableGuild.fromDto(dto))));
    }
}
