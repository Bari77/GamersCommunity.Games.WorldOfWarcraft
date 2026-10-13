import { Injectable } from "@angular/core";
import { BaseService } from "@shared/services/base.service";
import { map, Observable } from "rxjs";
import { PlatformUserAvatar } from "../models/platform-user-avatar.model";

@Injectable()
export class PlatformUsersService extends BaseService {
    public constructor() {
        super("/platform/users");
    }

    public getAvatarUrl(publicId: string): Observable<string> {
        return this.getOne(PlatformUserAvatar, publicId).pipe(map((user) => user.avatarUrl));
    }
}
