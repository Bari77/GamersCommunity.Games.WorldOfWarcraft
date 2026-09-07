import { Injectable } from "@angular/core";
import { BaseService } from "@shared/services/base.service";
import { map, Observable } from "rxjs";

interface PublicUserDto {
    publicId: string;
    avatarUrl: string;
}

@Injectable({ providedIn: "root" })
export class PlatformUsersService extends BaseService {
    public constructor() {
        super("/platform/users");
    }

    public getAvatarUrl(publicId: string): Observable<string> {
        return this.http.get<PublicUserDto>(this.getURL(publicId)).pipe(map((dto) => dto.avatarUrl));
    }
}
