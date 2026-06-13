import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { DtoConvertibleClass } from "@shared/models/base-model";
import { environment } from "environments/environment";
import { map, Observable } from "rxjs";

export abstract class BaseService {
    protected readonly http: HttpClient = inject(HttpClient);

    public constructor(private baseUrlService: string) {}

    protected getAll<Tdto, Tmodel>(
        modelClass: DtoConvertibleClass<Tdto, Tmodel>,
        url: string | null = null,
    ): Observable<Tmodel[]> {
        return this.http.get<Tdto[]>(this.getURL(url)).pipe(map((dtos) => dtos.map((dto) => modelClass.fromDto(dto))));
    }

    private getURL(url: string | null = null): string {
        const base = new URL(environment.apiUrl);
        const parts = [this.baseUrlService, url].filter(Boolean);

        for (const part of parts) {
            base.pathname = `${base.pathname.replace(/\/+$/, "")}/${part!.replace(/^\/+/, "")}`;
        }

        return base.toString().replace(/\/+$/, "");
    }
}
