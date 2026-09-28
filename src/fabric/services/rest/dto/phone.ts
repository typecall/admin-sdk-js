import type { PhoneModel } from "../../../domains/workspace/phone.js";

export interface PhoneLineAssignment {
  line_number: number;
  user_id: string;
  password?: string;
}

export interface CreatePhoneRequest {
  name: string;
  model: PhoneModel;
  location: string;
  is_cloud_managed: boolean;
  serial_number?: string | null;
  mac_address?: string | null;
  lines?: PhoneLineAssignment[];
}

export interface UpdatePhoneRequest {
  name?: string;
  model?: PhoneModel;
  location?: string;
  is_cloud_managed?: boolean;
  serial_number?: string | null;
  mac_address?: string | null;
  lines?: PhoneLineAssignment[];
}

export interface PhoneConfigResponse {
  config: string;
}
