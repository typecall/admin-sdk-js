import type { Country } from "../../common/country.js";
import type { EntityDeleted } from "../../common/entity.js";

export type DevicePlatform = "Android" | "Ios" | "Macos" | "Windows";

export interface Device {
  id: string;
  account_id: string;
  device_name: string;
  device_token: string;
  platform: DevicePlatform;
  location: Country;
  password: string;
  sbc_primary: string;
  sbc_secondary: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type DeviceEventType = "Upserted" | "Deleted";

export type DeviceEvent =
  | { event_type: "Upserted"; payload: Device }
  | { event_type: "Deleted"; payload: EntityDeleted };
