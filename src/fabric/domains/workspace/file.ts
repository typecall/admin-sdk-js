import type { EntityDeleted } from "../../common/entity.js";

export type FileCategory = "Avatar" | "Track";

export interface File {
  id: string;
  workspace_id: string;
  category: FileCategory;
  path: string;
  entity_id?: string | null;
  mime_type?: string | null;
  size_bytes?: number | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type FileEventType = "Upserted" | "Deleted";

export type FileEvent =
  | { event_type: "Upserted"; payload: File }
  | { event_type: "Deleted"; payload: EntityDeleted };
