import type { EntityDeleted } from "../../common/entity.js";
import type { IntegrationChannel } from "./integration_channel.js";

export type IntegrationPlatform = "WhatsApp";

export interface WhatsAppSettings {
  waba_id: string;
  access_token: string;
  verify_token: string;
}

export type IntegrationSettings =
  | { WhatsApp: WhatsAppSettings };

export interface Integration {
  id: string;
  workspace_id: string;
  platform: IntegrationPlatform;
  first_contact_at?: string | null;
  is_active: boolean;
  settings: IntegrationSettings;
  user_id?: string | null;
  channels: IntegrationChannel[];
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type IntegrationEventType = "Upserted" | "Deleted";

export type IntegrationEvent =
  | { event_type: "Upserted"; payload: Integration }
  | { event_type: "Deleted"; payload: EntityDeleted };
