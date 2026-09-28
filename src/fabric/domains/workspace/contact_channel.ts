import type { EntityDeleted } from "../../common/entity.js";

export type ContactChannelRole = "Owner" | "Editor" | "Viewer";

export interface ContactChannel {
  id: string;
  workspace_id: string;
  contact_id: string;
  channel_id: string;
  role: ContactChannelRole;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type ContactChannelEventType = "Upserted" | "Deleted";

export type ContactChannelEvent =
  | { event_type: "Upserted"; payload: ContactChannel }
  | { event_type: "Deleted"; payload: EntityDeleted };
