import type {
  CallCategory,
  CallConversationType,
  CallDisconnectedReason,
  CallOutcome,
  CallRecordingMode,
  CallSupervisionMode,
  CallTransferKind,
} from "../../common/call.js";
import type { Handle } from "../../common/handle.js";
import type { Charge } from "./charge.js";
import type { Utterance } from "./utterance.js";

export type BypassReason = "ZeroRingDuration" | "UnresolvedRingDuration";

export type CallEventPayloadType =
  | "CallStarted"
  | "CallPickedUp"
  | "CallEnded"
  | "CallTakenOver"
  | "ConnectionBypassed"
  | "ConnectingToChannel"
  | "ConnectingToChannelRingAll"
  | "ConnectingToChannelRingOrdered"
  | "ConnectingToChannelRingRandom"
  | "ConnectingToChannelRingRandomSequence"
  | "ConnectingToE164"
  | "ConnectingToUser"
  | "ConnectingToAiAgent"
  | "ConversationReached"
  | "EndpointConnecting"
  | "EndpointRinging"
  | "EndpointAnswered"
  | "EndpointDisconnected"
  | "ParticipantCreated"
  | "ParticipantAddedToBridge"
  | "ParticipantMuted"
  | "ParticipantUnmuted"
  | "ParticipantPlacedOnHold"
  | "ParticipantRemovedFromHold"
  | "ParticipantSwapped"
  | "ParticipantRemoved"
  | "RecordingStarted"
  | "RecordingStopped"
  | "RecordingDisabled"
  | "RecordingActionSkipped"
  | "TransferInitiated"
  | "TransferAnnouncing"
  | "TransferPerformed"
  | "TransferCompleted"
  | "TransferCanceled"
  | "TransferFailed"
  | "TransferMergedToConference"
  | "TransferReturnedToCall"
  | "VoicemailStarted"
  | "VoicemailFinished"
  | "VoicemailCanceled"
  | "RedirectedToEndCall"
  | "RedirectedToForwardCall"
  | "SupervisionInitiated"
  | "SupervisionModeChanged"
  | "SupervisionCanceled";

export type CallEventPayload =
  | { payload_type: "CallStarted"; payload: { communication_id: string } }
  | {
      payload_type: "CallPickedUp";
      payload: { initiator: Handle; endpoint_id: string };
    }
  | { payload_type: "CallEnded" }
  | {
      payload_type: "CallTakenOver";
      payload: { initiator: Handle; target: Handle };
    }
  | {
      payload_type: "ConnectionBypassed";
      payload: { subject: Handle; reason: BypassReason };
    }
  | {
      payload_type: "ConnectingToChannel";
      payload: { channel_id: string; user_id?: string | null };
    }
  | {
      payload_type: "ConnectingToChannelRingAll";
      payload: { user_ids: string[]; ring_duration_ms: number };
    }
  | {
      payload_type: "ConnectingToChannelRingOrdered";
      payload: { ring_duration_ms: number };
    }
  | {
      payload_type: "ConnectingToChannelRingRandom";
      payload: { ring_duration_ms: number };
    }
  | {
      payload_type: "ConnectingToChannelRingRandomSequence";
      payload: { ring_duration_ms: number };
    }
  | {
      payload_type: "ConnectingToE164";
      payload: { subject: Handle; sip_trunk_id: string };
    }
  | { payload_type: "ConnectingToUser"; payload: { user_id: string } }
  | { payload_type: "ConnectingToAiAgent"; payload: { subject: Handle } }
  | {
      payload_type: "ConversationReached";
      payload: {
        conversation_type: CallConversationType;
        conversation_id: string;
        thread_handle?: Handle | null;
      };
    }
  | { payload_type: "EndpointConnecting"; payload: { endpoint_id: string } }
  | { payload_type: "EndpointRinging"; payload: { endpoint_id: string } }
  | { payload_type: "EndpointAnswered"; payload: { endpoint_id: string } }
  | {
      payload_type: "EndpointDisconnected";
      payload: { endpoint_id: string; reason: CallDisconnectedReason };
    }
  | {
      payload_type: "ParticipantCreated";
      payload: { subject: Handle; is_caller: boolean };
    }
  | { payload_type: "ParticipantAddedToBridge"; payload: { subject: Handle } }
  | { payload_type: "ParticipantRemoved"; payload: { subject: Handle } }
  | {
      payload_type: "ParticipantMuted";
      payload: { initiator: Handle; subject: Handle };
    }
  | {
      payload_type: "ParticipantUnmuted";
      payload: { initiator: Handle; subject: Handle };
    }
  | {
      payload_type: "ParticipantPlacedOnHold";
      payload: { initiator: Handle; subject: Handle };
    }
  | {
      payload_type: "ParticipantRemovedFromHold";
      payload: { initiator: Handle; subject: Handle };
    }
  | {
      payload_type: "ParticipantSwapped";
      payload: { initiator: Handle; target: Handle };
    }
  | {
      payload_type: "RecordingStarted";
      payload: { initiator: Handle; is_forced: boolean };
    }
  | {
      payload_type: "RecordingStopped";
      payload: { initiator: Handle; is_forced: boolean };
    }
  | { payload_type: "RecordingDisabled"; payload: { initiator: Handle } }
  | {
      payload_type: "RecordingActionSkipped";
      payload: {
        initiator: Handle;
        current: CallRecordingMode;
        requested: CallRecordingMode;
      };
    }
  | {
      payload_type: "TransferInitiated";
      payload: { initiator: Handle; subject: Handle };
    }
  | { payload_type: "TransferAnnouncing" }
  | {
      payload_type: "TransferPerformed";
      payload: { target: Handle; kind: CallTransferKind };
    }
  | { payload_type: "TransferCompleted" }
  | { payload_type: "TransferCanceled" }
  | { payload_type: "TransferFailed" }
  | { payload_type: "TransferMergedToConference" }
  | { payload_type: "TransferReturnedToCall" }
  | { payload_type: "VoicemailStarted"; payload: { subject: Handle } }
  | { payload_type: "VoicemailFinished"; payload: { subject: Handle } }
  | { payload_type: "VoicemailCanceled"; payload: { subject: Handle } }
  | { payload_type: "RedirectedToEndCall"; payload: { subject: Handle } }
  | {
      payload_type: "RedirectedToForwardCall";
      payload: { subject: Handle; target: Handle };
    }
  | {
      payload_type: "SupervisionInitiated";
      payload: {
        supervisor: Handle;
        targets: Handle[];
        mode: CallSupervisionMode;
      };
    }
  | {
      payload_type: "SupervisionModeChanged";
      payload: {
        supervisor: Handle;
        targets: Handle[];
        mode: CallSupervisionMode;
      };
    }
  | { payload_type: "SupervisionCanceled"; payload: { supervisor: Handle } };

export type CallEvent = {
  id: string;
  workspace_id: string;
  communication_id: string;
  parent_id?: string | null;
  subject_id?: string | null;
  subject_type?: string | null;
  occurred_at: string;
  position: number;
} & CallEventPayload;

export interface Call {
  id: string;
  workspace_id: string;
  src_handle: Handle;
  dst_handle: Handle;
  category: CallCategory;
  events: CallEvent[];
  recording_path?: string | null;
  recording_waveform: number[];
  recording_duration_ms?: number | null;
  utterances: Utterance[];
  charges: Charge[];
}

export interface CallLog {
  id: string;
  workspace_id: string;
  originated_at: string;
  answered_at?: string | null;
  terminated_at?: string | null;
  src_handle: Handle;
  dst_handle: Handle;
  src_lookup?: string | null;
  dst_lookup?: string | null;
  category: CallCategory;
  outcome: CallOutcome;
  recording_duration_ms?: number | null;
  recording_path?: string | null;
  recording_waveform: number[];
}
