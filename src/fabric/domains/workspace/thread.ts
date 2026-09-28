import type { EntityDeleted } from "../../common/entity.js";
import type { Handle } from "../../common/handle.js";

export interface ThreadKey {
  channel_id: string;
  handle: Handle;
}

export interface Thread {
  id: string;
  workspace_id: string;
  channel_id: string;
  handle: Handle;
  latest_communication_id: string;
  seen_up_to_communication_id?: string | null;
  closed_at?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface ThreadClosed {
  workspace_id: string;
  channel_id: string;
  thread_handle: Handle;
}

export interface ThreadOpened {
  workspace_id: string;
  channel_id: string;
  thread_handle: Handle;
}

export type ThreadEventType =
  | "Upserted"
  | "Closed"
  | "Opened"
  | "Deleted";

export type ThreadEvent =
  | { event_type: "Upserted"; payload: Thread }
  | { event_type: "Closed"; payload: ThreadClosed }
  | { event_type: "Opened"; payload: ThreadOpened }
  | { event_type: "Deleted"; payload: EntityDeleted };
