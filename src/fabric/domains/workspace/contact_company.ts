import type { EntityDeleted } from "../../common/entity.js";

export interface ContactCompany {
  id: string;
  workspace_id: string;
  contact_id: string;
  company_id: string;
  job_title?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type ContactCompanyEventType = "Upserted" | "Deleted";

export type ContactCompanyEvent =
  | { event_type: "Upserted"; payload: ContactCompany }
  | { event_type: "Deleted"; payload: EntityDeleted };
