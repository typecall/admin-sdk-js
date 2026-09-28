import type { EntityDeleted } from "../../common/entity.js";
import type { ContactChannelRole } from "./contact_channel.js";

export interface IntegrationChannel {
  id: string;
  workspace_id: string;
  integration_id: string;
  channel_id: string;
  role: ContactChannelRole;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type IntegrationChannelEventType = "Upserted" | "Deleted";

export type IntegrationChannelEvent =
  | { event_type: "Upserted"; payload: IntegrationChannel }
  | { event_type: "Deleted"; payload: EntityDeleted };
