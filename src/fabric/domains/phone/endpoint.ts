import type { EntityDeleted } from "../../common/entity.js";
import type { DevicePlatform } from "../account/device.js";

export interface DeviceEndpoint {
  account_id: string;
  platform: DevicePlatform;
  token: string;
}

export interface PhoneEndpoint {
  workspace_id: string;
  user_id?: string | null;
  mac_address?: string | null;
}

export type EndpointCategory =
  | { Device: DeviceEndpoint }
  | { Phone: PhoneEndpoint };

export interface Endpoint {
  id: string;
  password: string;
  name: string;
  sbc_primary: string;
  sbc_secondary: string;
  category?: EndpointCategory | null;
}

export type EndpointEventType = "Upserted" | "Deleted";

export type EndpointEvent =
  | { event_type: "Upserted"; payload: Endpoint }
  | { event_type: "Deleted"; payload: EntityDeleted };
