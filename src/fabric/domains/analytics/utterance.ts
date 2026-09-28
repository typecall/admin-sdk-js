import type { Handle } from "../../common/handle.js";
import type { LanguageCode } from "../../common/language.js";

export interface UtteranceWord {
  word: string;
  start_ms: number;
  end_ms: number;
  confidence?: number | null;
}

export interface Utterance {
  id: string;
  workspace_id: string;
  communication_id: string;
  spoken_at: string;
  speaker_handle: Handle;
  start_ms: number;
  end_ms: number;
  confidence: number;
  language_codes: LanguageCode[];
  stt_model?: string | null;
  transcript: string;
  words: UtteranceWord[];
}

export interface UtteranceLite {
  id: string;
  workspace_id: string;
  communication_id: string;
  spoken_at: string;
  speaker_handle: Handle;
  start_ms: number;
  end_ms: number;
  confidence: number;
  language_codes: LanguageCode[];
  transcript: string;
  words: UtteranceWord[];
}
