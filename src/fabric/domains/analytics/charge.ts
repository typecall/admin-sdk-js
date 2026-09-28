import type { Money } from "../../common/money.js";

export type ChargeCategory = "IncomingCall" | "OutgoingCall";

export interface Charge {
  id: string;
  workspace_id: string;
  communication_id: string;
  incurred_at: string;
  category: ChargeCategory;
  amount: Money;
  description?: string | null;
}
