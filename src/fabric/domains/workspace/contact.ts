import type { EntityDeleted } from "../../common/entity.js";
import type { Field } from "../../common/field.js";
import type { Handle } from "../../common/handle.js";
import type { Note } from "../../common/note.js";
import type { ContactChannel } from "./contact_channel.js";
import type { ContactCompany } from "./contact_company.js";
import type { Tag } from "./tag.js";

export interface Contact {
  id: string;
  workspace_id: string;
  first_name: string;
  last_name?: string | null;
  fields: Field[];
  tags: Tag[];
  notes: Note[];
  avatar_path?: string | null;
  avatar_hash?: string | null;
  integration_id?: string | null;
  companies: ContactCompany[];
  channels: ContactChannel[];
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface ContactAccessGranted {
  contact: Contact;
  granted_by?: Handle | null;
}

export interface ContactAccessRevoked {
  workspace_id: string;
  contact_id: string;
  revoked_by?: Handle | null;
}

export type ContactEventType =
  | "Upserted"
  | "Deleted"
  | "AccessGranted"
  | "AccessRevoked";

export type ContactEvent =
  | { event_type: "Upserted"; payload: Contact }
  | { event_type: "Deleted"; payload: EntityDeleted }
  | { event_type: "AccessGranted"; payload: ContactAccessGranted }
  | { event_type: "AccessRevoked"; payload: ContactAccessRevoked };
