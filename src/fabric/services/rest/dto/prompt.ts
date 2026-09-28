import { z } from "zod";
import type {
  PromptScope,
  PromptTrack,
} from "../../../domains/workspace/prompt.js";

export const PromptTrackSchema = z.object({
  id: z.string(),
  path: z.string().optional().default(""),
  category: z.string(),
  duration_ms: z.number().min(0).default(0),
  tts_ssml: z.string().optional().nullable(),
  file_name: z.string().optional().nullable(),
  tts_voice_id: z.string().optional().nullable(),
  language_code: z.string().optional(),
  language: z.string().optional(),
});

export const CreatePromptRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  scope: z.string().optional().default("call-flow"),
  entity_id: z.string(),
  default_track_id: z.string().optional().nullable(),
  tracks: z.record(z.string(), PromptTrackSchema),
});

export type CreatePromptRequest = {
  name: string;
  scope?: PromptScope | string;
  entity_id: string;
  default_track_id?: string | null;
  tracks: Record<string, PromptTrack>;
};

export const UpdatePromptRequestSchema = z.object({
  name: z.string().min(1).optional(),
  default_track_id: z.string().optional().nullable(),
  tracks: z.record(z.string(), PromptTrackSchema).optional(),
});

export type UpdatePromptRequest = {
  name?: string;
  default_track_id?: string | null;
  tracks?: Record<string, PromptTrack>;
};
