import { Injectable } from "@angular/core";
import { BaseService } from "@shared/services/base.service";
import { map, Observable } from "rxjs";

/** Minimal Platform user projection used by WoW for avatars. */
export class PlatformUserAvatar {
    public constructor(
        public publicId: string,
        public avatarUrl: string,
    ) {}

    public static fromDto(dto: { publicId: string; avatarUrl: string }): PlatformUserAvatar {
        return new PlatformUserAvatar(dto.publicId, dto.avatarUrl ?? "");
    }
}

@Injectable()
export class PlatformUsersService extends BaseService {
    public constructor() {
        super("/platform/users");
    }

    public getAvatarUrl(publicId: string): Observable<string> {
        return this.getOne(PlatformUserAvatar, publicId).pipe(map((user) => user.avatarUrl));
    }
}
