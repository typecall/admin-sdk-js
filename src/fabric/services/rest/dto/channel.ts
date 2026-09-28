import type {
  CallRecordingMode,
  ChannelIncomingCallDistribution,
  ChannelOutgoingCallMapping,
  ChannelAiAgent,
} from "../../../domains/workspace/channel.js";

export interface ChannelUserAssignment {
  id: string;
  role: string;
}

export interface CreateChannelRequest {
  name: string;
  avatar_path?: string | null;
  avatar_hash?: string | null;
  icon?: string | null;
  record_incoming?: CallRecordingMode;
  record_outgoing?: CallRecordingMode;
  incoming_call_distribution?: ChannelIncomingCallDistribution[];
  outgoing_call_mappings?: ChannelOutgoingCallMapping[];
  ai_agent?: ChannelAiAgent | null;
  users?: ChannelUserAssignment[];
}

export interface UpdateChannelRequest {
  name?: string;
  avatar_path?: string | null;
  avatar_hash?: string | null;
  icon?: string | null;
  record_incoming?: CallRecordingMode;
  record_outgoing?: CallRecordingMode;
  incoming_call_distribution?: ChannelIncomingCallDistribution[];
  outgoing_call_mappings?: ChannelOutgoingCallMapping[];
  ai_agent?: ChannelAiAgent | null;
  users?: ChannelUserAssignment[];
}
