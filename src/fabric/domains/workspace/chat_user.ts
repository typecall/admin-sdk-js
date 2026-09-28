import type { ConversationUserRole } from "../../common/conversation.js";
import type { EntityDeleted } from "../../common/entity.js";

export interface ChatUser {
  id: string;
  workspace_id: string;
  chat_id: string;
  user_id: string;
  role: ConversationUserRole;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type ChatUserEventType = "Upserted" | "Deleted";

export type ChatUserEvent =
  | { event_type: "Upserted"; payload: ChatUser }
  | { event_type: "Deleted"; payload: EntityDeleted };
