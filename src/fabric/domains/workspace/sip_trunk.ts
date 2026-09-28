import type { EntityDeleted } from "../../common/entity.js";

export type SipTrunkProvider =
  | "IntTwilio"
  | "IntDidww"
  | "IntDidlogic"
  | "MtEpic"
  | "MtGo"
  | "MtMelita"
  | "IeVirgin"
  | "UkGamma"
  | "CyEpic";

export interface SipTrunk {
  id: string;
  workspace_id: string;
  name: string;
  itsp_primary: string;
  itsp_secondary: string;
  channels?: number | null;
  provider?: SipTrunkProvider | null;
  template?: string | null;
  server?: string | null;
  username?: string | null;
  password?: string | null;
  ipv4?: string | null;
  ipv6?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type SipTrunkEventType = "Upserted" | "Deleted";

export type SipTrunkEvent =
  | { event_type: "Upserted"; payload: SipTrunk }
  | { event_type: "Deleted"; payload: EntityDeleted };
