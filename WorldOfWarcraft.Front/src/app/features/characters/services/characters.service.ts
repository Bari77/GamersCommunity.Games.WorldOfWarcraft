import { Injectable } from "@angular/core";
import {
    CharacterCreateRequestDto,
    CharacterDto,
    CharacterListRequestDto,
    CharacterOptionsDto,
    CharacterSearchRequestDto,
    CharacterUpdateRequestDto,
} from "@features/characters/dto/character.dto";
import { Character, CharacterOptions, CharacterSearchPage } from "@features/characters/models/character.model";
import { BaseService } from "@shared/services/base.service";
import { Observable } from "rxjs";

@Injectable()
export class CharactersService extends BaseService {
    public constructor() {
        super("/worldofwarcraft/Characters");
    }

    public listByPlayer(playerPublicId: string): Observable<Character[]> {
        const payload: CharacterListRequestDto = { playerPublicId };
        return this.postList(Character, "actions/List", payload);
    }

    public getByPublicId(publicId: string): Observable<Character> {
        return this.getOne<CharacterDto, Character>(Character, publicId);
    }

    public search(request: CharacterSearchRequestDto): Observable<CharacterSearchPage> {
        return this.post(CharacterSearchPage, "actions/Search", request);
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
        return this.delete(publicId);
    }
}
