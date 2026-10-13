import { Injectable } from "@angular/core";
import { PostableGuild } from "@features/lfg/models/postable-guild.model";
import { BaseService } from "@shared/services/base.service";
import { Observable } from "rxjs";

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
