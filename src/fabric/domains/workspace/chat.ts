import type { EntityDeleted } from "../../common/entity.js";
import type { Handle } from "../../common/handle.js";
import type { ChatUser } from "./chat_user.js";

export interface Chat {
  id: string;
  workspace_id: string;
  name?: string | null;
  description?: string | null;
  avatar_path?: string | null;
  avatar_hash?: string | null;
  icon?: string | null;
  users: ChatUser[];
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface ChatAccessGranted {
  chat: Chat;
  granted_by?: Handle | null;
}

export interface ChatAccessRevoked {
  workspace_id: string;
  chat_id: string;
  revoked_by?: Handle | null;
}

export type ChatEventType =
  | "Upserted"
  | "Deleted"
  | "AccessGranted"
  | "AccessRevoked";

export type ChatEvent =
  | { event_type: "Upserted"; payload: Chat }
  | { event_type: "Deleted"; payload: EntityDeleted }
  | { event_type: "AccessGranted"; payload: ChatAccessGranted }
  | { event_type: "AccessRevoked"; payload: ChatAccessRevoked };
