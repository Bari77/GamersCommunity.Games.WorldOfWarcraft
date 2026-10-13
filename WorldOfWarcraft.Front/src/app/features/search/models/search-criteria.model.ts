import { SearchScope } from "../stores/global-search.store";

export interface SearchCriteria {
    query: string;
    scope: SearchScope;
    idServer: number | null;
    idAlignment: number | null;
    idClass: number | null;
    idRace: number | null;
    idDirection: number | null;
    idSpecializationClass: number | null;
    minLevel: number | null;
    minIlvl: number | null;
    orientation: string | null;
    minMembers: number | null;
    mainOnly: boolean;
    inGuild: boolean | null;
}
