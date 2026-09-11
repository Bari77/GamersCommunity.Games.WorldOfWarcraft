import { Injectable } from "@angular/core";
import {
    GamePostCreateRequestDto,
    GamePostDto,
    GamePostModerateRequestDto,
    GamePostPageDto,
    GamePostTargetRequestDto,
    GuildWallRequestDto,
} from "@features/guilds/dto/game-post.dto";
import { GamePost, GamePostPage } from "@features/guilds/models/game-post.model";
import { BaseService } from "@shared/services/base.service";
import { map, Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class GamePostsService extends BaseService {
    public constructor() {
        super("/worldofwarcraft/GamePosts");
    }

    /** Approved posts of a guild, readable by anyone. */
    public listGuildWall(request: GuildWallRequestDto): Observable<GamePostPage> {
        return this.pageAt("actions/ListGuildWall", request);
    }

    /** Posts awaiting a decision, reserved to the guild leader and officers. */
    public listPending(request: GuildWallRequestDto): Observable<GamePostPage> {
        return this.pageAt("actions/ListPending", request);
    }

    public create(request: GamePostCreateRequestDto): Observable<GamePost> {
        return this.post<GamePostDto, GamePost>(GamePost, "actions/Create", request);
    }

    public moderate(request: GamePostModerateRequestDto): Observable<GamePost> {
        return this.post<GamePostDto, GamePost>(GamePost, "actions/Moderate", request);
    }

    public remove(request: GamePostTargetRequestDto): Observable<GamePostTargetRequestDto> {
        return this.http.post<GamePostTargetRequestDto>(this.getURL("actions/Delete"), request);
    }

    private pageAt(action: string, payload: GuildWallRequestDto): Observable<GamePostPage> {
        return this.http
            .post<GamePostPageDto>(this.getURL(action), payload)
            .pipe(map((dto) => GamePostPage.fromDto(dto)));
    }
}
