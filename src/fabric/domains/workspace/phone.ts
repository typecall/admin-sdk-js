import type { Country } from "../../common/country.js";
import type { EntityDeleted } from "../../common/entity.js";

export type PhoneModel =
  | "SnomD120"
  | "SnomD140"
  | "SnomD150"
  | "SnomD717"
  | "SnomD785"
  | "YealinkSipT48u";

export interface PhoneLine {
  id: string;
  user_id: string;
  password: string;
  line_number: number;
}

export interface Phone {
  id: string;
  workspace_id: string;
  name: string;
  model: PhoneModel;
  serial_number?: string | null;
  mac_address?: string | null;
  location: Country;
  lines: PhoneLine[];
  is_cloud_managed: boolean;
  sbc_primary: string;
  sbc_secondary: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type PhoneEventType = "Upserted" | "Deleted";

export type PhoneEvent =
  | { event_type: "Upserted"; payload: Phone }
  | { event_type: "Deleted"; payload: EntityDeleted };
