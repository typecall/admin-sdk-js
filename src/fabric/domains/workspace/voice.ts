import type { EntityDeleted } from "../../common/entity.js";
import type { Gender } from "../../common/gender.js";
import type { LanguageCode } from "../../common/language.js";

export type { Gender };

/** @deprecated Use `Gender` from `../../common/gender.js` instead. */
export type VoiceGender = Gender;

export type VoiceProvider =
  | "Aws"
  | "Azure"
  | "Deepgram"
  | "ElevenLabs"
  | "Google"
  | "SmallestAi"
  | (string & {});

export type VoiceScope = "Tts" | "VoiceAgent" | (string & {});

export interface Voice {
  id: string;
  workspace_id?: string;
  name: string;
  language_code: LanguageCode | string;
  gender: Gender;
  scope: VoiceScope;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface VoiceInternal extends Voice {
  provider: VoiceProvider;
  provider_id: string;
}

/** @deprecated Use `Voice` instead. */
export type VoiceLite = Voice;

export type VoiceEventType = "Upserted" | "UpsertedInternal" | "Deleted";

export type VoiceEvent =
  | { event_type: "Upserted"; payload: Voice }
  | { event_type: "UpsertedInternal"; payload: VoiceInternal }
  | { event_type: "Deleted"; payload: EntityDeleted };
