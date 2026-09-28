import type { EntityType } from "./entity.js";

export const SCHEME_USER = "usr";
export const SCHEME_AI_AGENT = "aia";
export const SCHEME_CHAT = "cht";
export const SCHEME_TEL = "tel";
export const SCHEME_EMAIL = "eml";
export const SCHEME_SYSTEM = "sys";

export type Handle = string;

export interface HandleEntity {
  id: string;
  entity_type: EntityType;
  handles: Handle[];
  display_name: string;
  initials: string;
  avatar_hash?: string | null;
  avatar_path?: string | null;
}
