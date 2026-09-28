import type { EntityDeleted } from "../../common/entity.js";

export interface Company {
  id: string;
  workspace_id: string;
  name: string;
  avatar_path?: string | null;
  avatar_hash?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type CompanyEventType = "Upserted" | "Deleted";

export type CompanyEvent =
  | { event_type: "Upserted"; payload: Company }
  | { event_type: "Deleted"; payload: EntityDeleted };
