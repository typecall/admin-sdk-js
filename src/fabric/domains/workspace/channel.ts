import type { CallRecordingMode } from "../../common/call.js";
import type { EntityDeleted } from "../../common/entity.js";
import type { Handle } from "../../common/handle.js";
import type { ChannelNumber, ChannelNumberLite } from "./channel_number.js";
import type { ChannelUser } from "./channel_user.js";

export type { CallRecordingMode };

export type ChannelCallDistributionStrategy =
  "All" | "Ordered" | "Random" | "RandomSequence";

export interface ChannelCallDistributionStep {
  user_ids: string[];
  ring_duration_ms: number;
}

export interface ChannelIncomingCallDistribution {
  strategy: ChannelCallDistributionStrategy;
  user_ids: string[];
  routing_tag_id?: string | null;
  ring_duration_ms: number;
  reporting_tag_ids: string[];
  ordering: ChannelCallDistributionStep[];
}

export interface ChannelDestinationPrefix {
  name: string;
  prefix: string;
}

export interface ChannelOutgoingCallMapping {
  prefixes: ChannelDestinationPrefix[];
  channel_number_id: string;
  is_enforced: boolean;
}

export interface ChannelAiAgent {
  voice_id: string;
  is_active: boolean;
  instructions: string;
  call_handle_rate: number;
  instructions_calls?: string | null;
  instructions_messages?: string | null;
}

export interface Channel {
  id: string;
  workspace_id: string;
  name: string;
  avatar_path?: string | null;
  avatar_hash?: string | null;
  icon?: string | null;
  is_private: boolean;
  record_incoming: CallRecordingMode;
  record_outgoing: CallRecordingMode;
  ai_agent?: ChannelAiAgent | null;
  incoming_call_distribution: ChannelIncomingCallDistribution[];
  outgoing_call_mappings: ChannelOutgoingCallMapping[];
  users: ChannelUser[];
  numbers: ChannelNumber[];
  created_at: string;
  updated_at: string;
  archived_at?: string | null;
  deleted_at?: string | null;
}

export interface ChannelLite {
  id: string;
  workspace_id: string;
  name: string;
  avatar_path?: string | null;
  avatar_hash?: string | null;
  icon?: string | null;
  is_private: boolean;
  record_incoming: CallRecordingMode;
  record_outgoing: CallRecordingMode;
  users: ChannelUser[];
  numbers: ChannelNumberLite[];
  created_at: string;
  updated_at: string;
  archived_at?: string | null;
  deleted_at?: string | null;
}

export interface ChannelAccessGranted {
  channel: ChannelLite;
  granted_by?: Handle | null;
}

export interface ChannelAccessRevoked {
  workspace_id: string;
  channel_id: string;
  revoked_by?: Handle | null;
}

export type ChannelEventType =
  "Upserted" | "UpsertedLite" | "Deleted" | "AccessGranted" | "AccessRevoked";

export type ChannelEvent =
  | { event_type: "Upserted"; payload: Channel }
  | { event_type: "UpsertedLite"; payload: ChannelLite }
  | { event_type: "Deleted"; payload: EntityDeleted }
  | { event_type: "AccessGranted"; payload: ChannelAccessGranted }
  | { event_type: "AccessRevoked"; payload: ChannelAccessRevoked };
