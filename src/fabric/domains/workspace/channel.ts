export type CallRecordingMode = "Off" | "Dual" | "Mixed";

export type ChannelCallDistributionStrategy =
   | "All"
   | "Ordered"
   | "Random"
   | "RandomSequence";

export interface ChannelDistributionStep {
   user_ids: string[];
   ring_duration_ms: number;
}

export interface ChannelIncomingCallDistribution {
   strategy: ChannelCallDistributionStrategy;
   user_ids: string[];
   routing_tag_id?: string | null;
   ring_duration_ms: number;
   reporting_tag_ids: string[];
   ordering: ChannelDistributionStep[];
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

export interface ChannelUserSummary {
   id: string;
   channel_id: string;
   user_id: string;
   role: string;
}

export interface ChannelNumberSummary {
   id: string;
   phone_number_id: string;
   cid: string;
   name: string;
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
   users: ChannelUserSummary[];
   numbers: ChannelNumberSummary[];
   created_at: string;
   updated_at: string;
   archived_at?: string | null;
   deleted_at?: string | null;
}
