import { Injectable } from "@angular/core";
import { CharacterDto, CharacterUpdateRequestDto } from "@features/characters/dto/character.dto";
import { CharacterSearchRequestDto } from "@features/characters/dto/character-search-request.dto";
import { CharacterOptionsDto } from "@features/characters/dto/character-options.dto";
import { CharacterListRequestDto } from "@features/characters/dto/character-list-request.dto";
import { CharacterCreateRequestDto } from "@features/characters/dto/character-create-request.dto";
import { Character } from "@features/characters/models/character.model";
import { CharacterSearchPage } from "@features/characters/models/character-search-page.model";
import { CharacterOptions } from "@features/characters/models/character-options.model";
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
