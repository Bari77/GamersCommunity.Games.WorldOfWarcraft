import { SearchScope } from "../stores/global-search.store";

export interface SearchCriteria {
    query: string;
    scope: SearchScope;
    idServer: number | null;
    idAlignment: number | null;
    idClass: number | null;
    minLevel: number | null;
}
