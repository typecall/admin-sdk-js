import type { CallSupervisionMode, CallTransferKind } from "../../common/call.js";
import type { Handle } from "../../common/handle.js";

export type PhoneCommandPayloadType =
  | "HoldParticipant"
  | "UnholdParticipant"
  | "MuteParticipant"
  | "UnmuteParticipant"
  | "SwapParticipant"
  | "InitiateTransfer"
  | "PerformTransfer"
  | "CancelTransfer"
  | "AbandonTransfer"
  | "CompleteTransfer"
  | "ConferenceTransfer"
  | "ChangeSupervisionMode"
  | "CancelSupervision"
  | "StartRecording"
  | "StopRecording";

export interface HoldParticipant {
  call_id: string;
  endpoint_id: string;
  initiator: Handle;
  subject: Handle;
}

export interface UnholdParticipant {
  call_id: string;
  endpoint_id: string;
  initiator: Handle;
  subject: Handle;
}

export interface MuteParticipant {
  call_id: string;
  endpoint_id: string;
  initiator: Handle;
  subject: Handle;
}

export interface UnmuteParticipant {
  call_id: string;
  endpoint_id: string;
  initiator: Handle;
  subject: Handle;
}

export interface SwapParticipant {
  call_id: string;
  endpoint_id: string;
  initiator: Handle;
  target: Handle;
}

export interface InitiateTransfer {
  call_id: string;
  endpoint_id: string;
  initiator: Handle;
  subject: Handle;
}

export interface PerformTransfer {
  call_id: string;
  endpoint_id: string;
  initiator: Handle;
  target: Handle;
  kind: CallTransferKind;
  channel_number_id?: string | null;
}

export interface CancelTransfer {
  call_id: string;
  endpoint_id: string;
  initiator: Handle;
}

export interface AbandonTransfer {
  call_id: string;
  endpoint_id: string;
  initiator: Handle;
}

export interface CompleteTransfer {
  call_id: string;
  endpoint_id: string;
  initiator: Handle;
}

export interface ConferenceTransfer {
  call_id: string;
  endpoint_id: string;
  initiator: Handle;
}

export interface ChangeSupervisionMode {
  call_id: string;
  endpoint_id: string;
  initiator: Handle;
  targets: Handle[];
  mode: CallSupervisionMode;
}

export interface CancelSupervision {
  call_id: string;
  endpoint_id: string;
  initiator: Handle;
}

export interface StartRecording {
  call_id: string;
  endpoint_id: string;
  initiator: Handle;
}

export interface StopRecording {
  call_id: string;
  endpoint_id: string;
  initiator: Handle;
}

export type PhoneCommandPayload =
  | { payload_type: "HoldParticipant"; payload: HoldParticipant }
  | { payload_type: "UnholdParticipant"; payload: UnholdParticipant }
  | { payload_type: "MuteParticipant"; payload: MuteParticipant }
  | { payload_type: "UnmuteParticipant"; payload: UnmuteParticipant }
  | { payload_type: "SwapParticipant"; payload: SwapParticipant }
  | { payload_type: "InitiateTransfer"; payload: InitiateTransfer }
  | { payload_type: "PerformTransfer"; payload: PerformTransfer }
  | { payload_type: "CancelTransfer"; payload: CancelTransfer }
  | { payload_type: "AbandonTransfer"; payload: AbandonTransfer }
  | { payload_type: "CompleteTransfer"; payload: CompleteTransfer }
  | { payload_type: "ConferenceTransfer"; payload: ConferenceTransfer }
  | { payload_type: "ChangeSupervisionMode"; payload: ChangeSupervisionMode }
  | { payload_type: "CancelSupervision"; payload: CancelSupervision }
  | { payload_type: "StartRecording"; payload: StartRecording }
  | { payload_type: "StopRecording"; payload: StopRecording };

export type PhoneCommand = {
  request_id: string;
} & PhoneCommandPayload;
