import type { EntityDeleted } from "../../common/entity.js";

export type PaymentMethodStatus = "Active" | "Expired" | "Failed";

export interface PaymentMethod {
  id: string;
  workspace_id: string;
  last_four: string;
  status: PaymentMethodStatus;
  expiry_month: number;
  expiry_year: number;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type PaymentMethodEventType = "Upserted" | "Deleted";

export type PaymentMethodEvent =
  | { event_type: "Upserted"; payload: PaymentMethod }
  | { event_type: "Deleted"; payload: EntityDeleted };
