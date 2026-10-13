import { Injectable } from "@angular/core";
import {
    CreateLfgMessageRequestDto,
    ListLfgBeforeRequestDto,
    LfgMessageDto,
} from "@features/lfg/dto/lfg-message.dto";
import { LfgKind, LfgMessage, PostableGuild } from "@features/lfg/models/lfg-message.model";
import { BaseService } from "@shared/services/base.service";
import { Observable } from "rxjs";

const PAGE_SIZE = 50;

@Injectable()
export class LfgChatService extends BaseService {
    public constructor() {
        super("/worldofwarcraft/LfgAds");
    }

    public listRecent(kind: LfgKind): Observable<LfgMessage[]> {
        return this.postList(LfgMessage, "actions/ListRecent", { kind });
    }

    public listBefore(kind: LfgKind, before: LfgMessage): Observable<LfgMessage[]> {
        const payload: ListLfgBeforeRequestDto = {
            kind,
            beforeCreationDate: before.creationDate.toISOString(),
            beforePublicId: before.publicId,
            take: PAGE_SIZE,
        };
        return this.postList(LfgMessage, "actions/ListBefore", payload);
    }

    public send(data: CreateLfgMessageRequestDto): Observable<LfgMessage> {
        return this.post<LfgMessageDto, LfgMessage>(LfgMessage, "actions/Create", data);
    }
}

@Injectable()
export class PostableGuildsService extends BaseService {
    public constructor() {
        super("/worldofwarcraft/Guilds");
    }

    /** Guilds the current player may post for, i.e. where one of their characters is officer or above. */
    public listPostable(): Observable<PostableGuild[]> {
        return this.postList(PostableGuild, "actions/ListPostable", {});
    }
}
