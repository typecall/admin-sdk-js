export type PromptScope = "System" | "Workspace" | "User";

export interface PromptTrack {
   id: string;
   name: string;
   file_path: string;
   duration_ms: number;
   language?: string | null;
}

export interface Prompt {
   id: string;
   name: string;
   scope: PromptScope;
   entity_id: string;
   default_track_id: string;
   workspace_id: string;
   tracks: Record<string, PromptTrack>;
   created_at: string;
   updated_at: string;
   deleted_at?: string | null;
}
