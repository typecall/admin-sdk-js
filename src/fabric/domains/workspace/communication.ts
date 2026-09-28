import type {
  CallCategory,
  CallOutcome,
  CallRecordingMode,
  CallStatus,
} from "../../common/call.js";
import type { EntityDeleted } from "../../common/entity.js";
import type { Handle } from "../../common/handle.js";

export type CommunicationPayloadType = "Message" | "Call" | "ActiveCall";

export type CommunicationMessagePlatform =
  | "Native"
  | { WhatsApp: { channel_number_id: string } };

export interface CommunicationMessage {
  id: string;
  body: string;
  attachments: string[];
  sender_handle: Handle;
  thread_handle?: Handle | null;
  platform: CommunicationMessagePlatform;
  sent_at: string;
}

export interface CommunicationCall {
  id: string;
  category: CallCategory;
  outcome: CallOutcome;
  src_handle: Handle;
  dst_handle: Handle;
  answerer_handle?: Handle | null;
  thread_handle?: Handle | null;
  talk_time_ms?: number | null;
  recording_duration_ms?: number | null;
  recording_path?: string | null;
  originated_at: string;
  terminated_at: string;
  answered_at?: string | null;
}

export interface CommunicationActiveCall {
  id: string;
  thread_handle?: Handle | null;
  current_conversation_id: string;
  src_handle: Handle;
  dst_handle: Handle;
  answerer_handle?: Handle | null;
  state: CallStatus;
  recording: CallRecordingMode;
  category: CallCategory;
  last_updated_at: string;
  entered_at: string;
  left_at?: string | null;
  gateway: string;
}

export type CommunicationPayload =
  | { payload_type: "Message"; payload: CommunicationMessage }
  | { payload_type: "Call"; payload: CommunicationCall }
  | { payload_type: "ActiveCall"; payload: CommunicationActiveCall };

export interface CommunicationReaction {
  workspace_id: string;
  communication_id: string;
  participant_handle: Handle;
  emoji: string;
}

export interface CommunicationReactionTombstone {
  workspace_id: string;
  communication_id: string;
  participant_handle: Handle;
}

export interface CommunicationReadMarker {
  workspace_id: string;
  conversation_id: string;
  communication_id: string;
  participant_handle: Handle;
  thread_handle?: Handle | null;
}

export type Communication = {
  id: string;
  workspace_id: string;
  conversation_id: string;
  category?: string | null;
  reactions: CommunicationReaction[];
  sender_handle: Handle;
  thread_handle?: Handle | null;
  started_at: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
} & CommunicationPayload;

export type CommunicationEventType =
  | "Upserted"
  | "Deleted"
  | "ReactionAdded"
  | "ReactionRemoved"
  | "Read"
  | "Unread";

export type CommunicationEvent =
  | { event_type: "Upserted"; payload: Communication }
  | { event_type: "Deleted"; payload: EntityDeleted }
  | { event_type: "ReactionAdded"; payload: CommunicationReaction }
  | { event_type: "ReactionRemoved"; payload: CommunicationReactionTombstone }
  | { event_type: "Read"; payload: CommunicationReadMarker }
  | { event_type: "Unread"; payload: CommunicationReadMarker };
