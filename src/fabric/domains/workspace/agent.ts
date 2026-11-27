import type { EntityDeleted } from "../../common/entity.js";
import type { Gender } from "../../common/gender.js";
import type { Handle } from "../../common/handle.js";
import type { LanguageCode } from "../../common/language.js";

export type AgentRole =
  | "Analyst"
  | "Operator"
  | "Receptionist"
  | (string & {});

export type AgentTool = Record<string, unknown>;

export interface Agent {
  id: string;
  workspace_id: string;
  name: string;
  role: AgentRole;
  is_active: boolean;
  avatar_path?: string | null;
  avatar_hash?: string | null;
  language_codes: (LanguageCode | string)[];
  gender?: Gender | null;
  instructions: string;
  tools: AgentTool[];
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface AgentInternal extends Agent {
  access_token: string;
}

export interface AgentReplyOpportunity {
  workspace_id: string;
  agent_id: string;
  agent_worker_id: string;
  conversation_id: string;
  thread_handle?: Handle | null;
  communication_id: string;
}

export type AgentEventType =
  | "Upserted"
  | "UpsertedInternal"
  | "Deleted"
  | "ReplyOpportunityDetected";

export type AgentEvent =
  | { event_type: "Upserted"; payload: Agent }
  | { event_type: "UpsertedInternal"; payload: AgentInternal }
  | { event_type: "Deleted"; payload: EntityDeleted }
  | {
      event_type: "ReplyOpportunityDetected";
      payload: AgentReplyOpportunity;
    };
