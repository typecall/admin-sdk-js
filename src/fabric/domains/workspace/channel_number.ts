import type { Country } from "../../common/country.js";
import type { EntityDeleted } from "../../common/entity.js";

export type ChannelNumberCapability =
  | "Voice"
  | "Sms"
  | "Mms"
  | "WhatsappMessaging"
  | "WhatsappVoice";

export interface ChannelNumber {
  id: string;
  workspace_id: string;
  phone_number_id: string;
  channel_id: string;
  cid: string;
  name: string;
  country: Country;
  label?: string | null;
  user_id?: string | null;
  priority: number;
  is_exclusive: boolean;
  capabilities: ChannelNumberCapability[];
  whatsapp_id?: string | null;
  whatsapp_password?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface ChannelNumberLite {
  id: string;
  workspace_id: string;
  phone_number_id: string;
  channel_id: string;
  cid: string;
  name: string;
  country: Country;
  label?: string | null;
  user_id?: string | null;
  priority: number;
  is_exclusive: boolean;
  capabilities: ChannelNumberCapability[];
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type ChannelNumberEventType = "Upserted" | "UpsertedLite" | "Deleted";

export type ChannelNumberEvent =
  | { event_type: "Upserted"; payload: ChannelNumber }
  | { event_type: "UpsertedLite"; payload: ChannelNumberLite }
  | { event_type: "Deleted"; payload: EntityDeleted };
