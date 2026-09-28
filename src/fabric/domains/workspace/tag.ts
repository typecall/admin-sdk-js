import type { EntityDeleted } from "../../common/entity.js";

export type TagScope =
  "CallScreen" | "Contact" | "Flow" | "call-screen" | "contact" | "flow";

export interface Tag {
  id: string;
  workspace_id: string;
  name: string;
  color: string;
  scopes: TagScope[];
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type TagEventType = "Upserted" | "Deleted";

export type TagEvent =
  | { event_type: "Upserted"; payload: Tag }
  | { event_type: "Deleted"; payload: EntityDeleted };
