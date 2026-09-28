import type { EntityDeleted } from "../../common/entity.js";

export type WorkspaceBillingProvider = "Stripe" | "Zoho";

export interface Workspace {
  id: string;
  name: string;
  avatar_path?: string | null;
  avatar_hash?: string | null;
  billing_provider: WorkspaceBillingProvider;
  billing_provider_id: string;
  billing_provider_subscription_id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface WorkspaceLite {
  id: string;
  name: string;
  avatar_path?: string | null;
  avatar_hash?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type WorkspaceEventType = "Upserted" | "UpsertedLite" | "Deleted";

export type WorkspaceEvent =
  | { event_type: "Upserted"; payload: Workspace }
  | { event_type: "UpsertedLite"; payload: WorkspaceLite }
  | { event_type: "Deleted"; payload: EntityDeleted };
