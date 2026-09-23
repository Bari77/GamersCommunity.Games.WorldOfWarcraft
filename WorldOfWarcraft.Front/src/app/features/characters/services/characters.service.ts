import { Injectable } from "@angular/core";
import {
    CharacterCreateRequestDto,
    CharacterDto,
    CharacterListRequestDto,
    CharacterOptionsDto,
    CharacterSearchRequestDto,
    CharacterSearchResultDto,
    CharacterUpdateRequestDto,
} from "@features/characters/dto/character.dto";
import { Character, CharacterOptions, CharacterSummary } from "@features/characters/models/character.model";
import { BaseService } from "@shared/services/base.service";
import { map, Observable } from "rxjs";

export interface CharacterSearchPage {
    items: CharacterSummary[];
    hasMore: boolean;
}

@Injectable()
export class CharactersService extends BaseService {
    public constructor() {
        super("/worldofwarcraft/Characters");
    }

    public listByPlayer(playerPublicId: string): Observable<Character[]> {
        const payload: CharacterListRequestDto = { playerPublicId };
        return this.http
            .post<CharacterDto[]>(this.getURL("actions/List"), payload)
            .pipe(map((dtos) => dtos.map((dto) => Character.fromDto(dto))));
    }

    public getByPublicId(publicId: string): Observable<Character> {
        return this.getOne<CharacterDto, Character>(Character, publicId);
    }

    public search(request: CharacterSearchRequestDto): Observable<CharacterSearchPage> {
        return this.http.post<CharacterSearchResultDto>(this.getURL("actions/Search"), request).pipe(
            map((dto) => ({
                items: (dto.items ?? []).map((item) => CharacterSummary.fromDto(item)),
                hasMore: dto.hasMore ?? false,
            })),
        );
    }

    public options(): Observable<CharacterOptions> {
        return this.post<CharacterOptionsDto, CharacterOptions>(CharacterOptions, "actions/Options", {});
    }

    public create(data: CharacterCreateRequestDto): Observable<Character> {
        return this.post<CharacterDto, Character>(Character, "actions/Create", data);
    }

    public update(publicId: string, data: CharacterUpdateRequestDto): Observable<Character> {
        return this.put<CharacterDto, Character>(Character, publicId, data);
    }

    public remove(publicId: string): Observable<void> {
        return this.http.delete<void>(this.getURL(publicId));
    }
}
