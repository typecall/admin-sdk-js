export type InvoiceStatus =
   | "Draft"
   | "Sent"
   | "Unpaid"
   | "Overdue"
   | "Paid"
   | "Void";

export interface Invoice {
   id: string;
   workspace_id: string;
   number: string;
   issue_date: string;
   due_date: string;
   currency: string;
   total: number;
   balance: number;
   status: InvoiceStatus;
   invoice_url?: string | null;
   created_at: string;
   updated_at: string;
   deleted_at?: string | null;
}

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

export type SubscriptionStatus =
   | "Trialing"
   | "Active"
   | "PastDue"
   | "Paused"
   | "Canceled"
   | "Unpaid";

export interface Subscription {
   id: string;
   workspace_id: string;
   number: string;
   status: SubscriptionStatus;
   interval: number;
   interval_unit: string;
   trial_days_remaining: number;
   renews_on?: string | null;
   currency: string;
   created_at: string;
   updated_at: string;
   deleted_at?: string | null;
}
