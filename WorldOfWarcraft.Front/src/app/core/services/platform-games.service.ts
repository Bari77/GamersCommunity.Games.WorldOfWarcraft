import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { map, Observable } from "rxjs";

interface PlatformGameDto {
    id: number;
    title: string;
    urlValue: string;
    picture: string;
}

export interface PlatformGame {
    id: number;
    title: string;
    url: string;
    iconUrl: string;
}

/** Reads the shell's game catalog so a game sheet can offer a switcher to the others. */
@Injectable({ providedIn: "root" })
export class PlatformGamesService {
    private readonly http = inject(HttpClient);

    public list(): Observable<PlatformGame[]> {
        return this.http
            .get<PlatformGameDto[]>(`${environment.apiUrl}/platform/games`)
            .pipe(map((dtos) => dtos.map((dto) => this.toGame(dto))));
    }

    private toGame(dto: PlatformGameDto): PlatformGame {
        return {
            id: dto.id,
            title: dto.title,
            url: dto.urlValue.startsWith("/") ? dto.urlValue : `/${dto.urlValue}`,
            iconUrl: `${environment.assetsBaseUrl}/Icons/Games/${dto.picture}.png`,
        };
    }
}
