import type { EntityDeleted } from "../../common/entity.js";
import type { Money } from "../../common/money.js";

export type InvoiceStatus =
  "Draft" | "Sent" | "Unpaid" | "Overdue" | "Paid" | "Void" | (string & {});

export interface Invoice {
  id: string;
  workspace_id?: string;
  number: string;
  issue_date: string;
  due_date: string;
  currency: string;
  total: Money | number | string;
  balance: Money | number | string;
  status: InvoiceStatus;
  customer_id?: string | null;
  invoice_url?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export type InvoiceEventType = "Upserted" | "Deleted";

export type InvoiceEvent =
  | { event_type: "Upserted"; payload: Invoice }
  | { event_type: "Deleted"; payload: EntityDeleted };
