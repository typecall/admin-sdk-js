import type { EntityDeleted } from "../../common/entity.js";

export interface Domain {
  id: string;
  workspace_id: string;
  domain: string;
  verified_at?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type DomainEventType = "Upserted" | "Deleted";

export type DomainEvent =
  | { event_type: "Upserted"; payload: Domain }
  | { event_type: "Deleted"; payload: EntityDeleted };
