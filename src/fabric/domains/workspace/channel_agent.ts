import type { EntityDeleted } from "../../common/entity.js";

export interface ChannelAgent {
  id: string;
  workspace_id: string;
  channel_id: string;
  agent_id: string;
  instructions?: string | null;
  instructions_voice?: string | null;
  instructions_messages?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type ChannelAgentEventType = "Upserted" | "Deleted";

export type ChannelAgentEvent =
  | { event_type: "Upserted"; payload: ChannelAgent }
  | { event_type: "Deleted"; payload: EntityDeleted };
