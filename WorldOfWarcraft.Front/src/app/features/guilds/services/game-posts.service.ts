import { Injectable } from "@angular/core";
import { GamePostDto } from "@features/guilds/dto/game-post.dto";
import { GuildWallRequestDto } from "@features/guilds/dto/guild-wall-request.dto";
import { GamePostUpdateRequestDto } from "@features/guilds/dto/game-post-update-request.dto";
import { GamePostModerateRequestDto } from "@features/guilds/dto/game-post-moderate-request.dto";
import { GamePostCreateRequestDto } from "@features/guilds/dto/game-post-create-request.dto";
import { GamePost } from "@features/guilds/models/game-post.model";
import { GamePostPage } from "@features/guilds/models/game-post-page.model";
import { BaseService } from "@shared/services/base.service";
import { Observable } from "rxjs";

@Injectable()
export class GamePostsService extends BaseService {
    public constructor() {
        super("/worldofwarcraft/GamePosts");
    }

    /** Approved posts of a guild, readable by anyone. */
    public listGuildWall(request: GuildWallRequestDto): Observable<GamePostPage> {
        return this.post(GamePostPage, "actions/ListGuildWall", request);
    }

    /** Posts awaiting a decision, reserved to the guild leader and officers. */
    public listPending(request: GuildWallRequestDto): Observable<GamePostPage> {
        return this.post(GamePostPage, "actions/ListPending", request);
    }

    public create(request: GamePostCreateRequestDto): Observable<GamePost> {
        return this.post<GamePostDto, GamePost>(GamePost, "actions/Create", request);
    }

    /** Rewrites a post; the microservice refuses anyone but its author. */
    public update(request: GamePostUpdateRequestDto): Observable<GamePost> {
        return this.post<GamePostDto, GamePost>(GamePost, "actions/Update", request);
    }

    public moderate(request: GamePostModerateRequestDto): Observable<GamePost> {
        return this.post<GamePostDto, GamePost>(GamePost, "actions/Moderate", request);
    }

    public remove(request: { publicId: string }): Observable<void> {
        return this.postVoid("actions/Delete", request);
    }
}
