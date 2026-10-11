import {
    resolveActivePersona,
    setActivePersonaId as storeActivePersonaId,
    type PlaygroundPersona,
} from "@bari77/gc-playground";
import { DEFAULT_PERSONA_ID, MOCK_PERSONAS, type MockPersona } from "./personas";

/** Gateway API segment / playground session key for this front. */
export const WOW_MOCK_GAME_KEY = "worldofwarcraft";

export function getSessionPersona(): MockPersona {
    return resolveActivePersona(WOW_MOCK_GAME_KEY, MOCK_PERSONAS, DEFAULT_PERSONA_ID);
}

export function setSessionPersonaId(personaId: string): void {
    storeActivePersonaId(WOW_MOCK_GAME_KEY, personaId);
}

export function sessionPersonaOptions(): readonly PlaygroundPersona[] {
    return MOCK_PERSONAS;
}
