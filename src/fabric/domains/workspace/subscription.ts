import type { EntityDeleted } from "../../common/entity.js";
import type { Money } from "../../common/money.js";

export type SubscriptionStatus =
  | "Trialing"
  | "Active"
  | "PastDue"
  | "Paused"
  | "Canceled"
  | "Unpaid";

export type SubscriptionIntervalUnit = "Day" | "Week" | "Month" | "Year";

export interface SubscriptionPlan {
  code: string;
  seats: number;
  unit_price?: Money | null;
  sub_total?: Money | null;
}

export interface SubscriptionAddon {
  code: string;
  quantity: number;
  unit_price?: Money | null;
  sub_total?: Money | null;
}

export interface SubscriptionTax {
  name: string;
  amount: Money;
}

export interface SubscriptionPartner {
  type: string;
  id: string;
  reference?: string | null;
  attributes: Record<string, string>;
}

export interface Subscription {
  id: string;
  workspace_id: string;
  number: string;
  status: SubscriptionStatus;
  interval: number;
  interval_unit: SubscriptionIntervalUnit;
  trial_days_remaining: number;
  renews_on?: string | null;
  currency: string;
  plan?: SubscriptionPlan | null;
  addons: SubscriptionAddon[];
  taxes: SubscriptionTax[];
  partner?: SubscriptionPartner | null;
  sub_total?: Money | null;
  total?: Money | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type SubscriptionEventType = "Upserted" | "Deleted";

export type SubscriptionEvent =
  | { event_type: "Upserted"; payload: Subscription }
  | { event_type: "Deleted"; payload: EntityDeleted };
