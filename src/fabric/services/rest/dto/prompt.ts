import type {
  PromptScope,
  PromptTrack,
} from "../../../domains/workspace/prompt.js";

export interface CreatePromptRequest {
  name: string;
  scope: PromptScope;
  entity_id: string;
  default_track_id?: string | null;
  tracks: Record<string, PromptTrack>;
}

export interface UpdatePromptRequest {
  name?: string;
  default_track_id?: string | null;
  tracks?: Record<string, PromptTrack>;
}
