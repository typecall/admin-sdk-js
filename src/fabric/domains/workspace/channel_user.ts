import type { ConversationUserRole } from "../../common/conversation.js";
import type { EntityDeleted } from "../../common/entity.js";

export interface ChannelUser {
  id: string;
  workspace_id: string;
  channel_id: string;
  user_id: string;
  role: ConversationUserRole;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type ChannelUserEventType = "Upserted" | "Deleted";

export type ChannelUserEvent =
  | { event_type: "Upserted"; payload: ChannelUser }
  | { event_type: "Deleted"; payload: EntityDeleted };
