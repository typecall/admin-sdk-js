import type { EntityDeleted } from "../../common/entity.js";
import type { LanguageCode } from "../../common/language.js";

export type VoiceGender = "Female" | "Male";

export type VoiceProvider =
  "Aws" | "Azure" | "Deepgram" | "ElevenLabs" | "Google" | "SmallestAi";

export type VoiceScope = "Tts" | "VoiceAgent";

export interface Voice {
  id: string;
  workspace_id: string;
  name: string;
  language_code: LanguageCode;
  gender: VoiceGender;
  scope: VoiceScope;
  provider: VoiceProvider;
  provider_id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface VoiceLite {
  id: string;
  workspace_id: string;
  name: string;
  language_code: LanguageCode;
  gender: VoiceGender;
  scope: VoiceScope;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type VoiceEventType = "Upserted" | "UpsertedLite" | "Deleted";

export type VoiceEvent =
  | { event_type: "Upserted"; payload: Voice }
  | { event_type: "UpsertedLite"; payload: VoiceLite }
  | { event_type: "Deleted"; payload: EntityDeleted };
