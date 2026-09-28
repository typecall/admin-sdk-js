import type { EntityDeleted } from "../../common/entity.js";
import type { LanguageCode } from "../../common/language.js";

export type PromptScope = "CallFlow" | "CallRedirect";

export type PromptTrackCategory = "File" | "Tts";

export interface PromptTrack {
  id: string;
  path: string;
  category: PromptTrackCategory;
  duration_ms: number;
  tts_ssml?: string | null;
  file_name?: string | null;
  tts_voice_id?: string | null;
  language_code: LanguageCode;
}

export interface Prompt {
  id: string;
  workspace_id: string;
  name: string;
  scope: PromptScope;
  default_track_id?: string | null;
  entity_id: string;
  tracks: Record<string, PromptTrack>;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type PromptEventType = "Upserted" | "Deleted";

export type PromptEvent =
  | { event_type: "Upserted"; payload: Prompt }
  | { event_type: "Deleted"; payload: EntityDeleted };
