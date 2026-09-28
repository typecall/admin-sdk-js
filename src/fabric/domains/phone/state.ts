import type {
  CallRecordingMode,
  CallStatus,
  CallTransferKind,
  CallTransferStatus,
} from "../../common/call.js";
import type { Handle } from "../../common/handle.js";

export interface TransferState {
  initiator: Handle;
  subject: Handle;
  target?: Handle | null;
  status: CallTransferStatus;
  kind?: CallTransferKind | null;
}

export type CallMode =
  | { type: "OneOnOne" }
  | { type: "Transferring"; transfer_state: TransferState }
  | { type: "Conferencing" };

export interface ActiveCallEndpoint {
  endpoint_id: string;
  status: CallStatus;
  connected_at?: string | null;
  is_muted: boolean;
  is_talking: boolean;
  is_on_hold: boolean;
  is_recording: boolean;
  latest_request_id?: string | null;
}

export interface ActiveCallParticipant {
  handle: Handle;
  endpoints: ActiveCallEndpoint[];
}

export interface ActiveCallStateChanged {
  call_id: string;
  workspace_id: string;
  recording: CallRecordingMode;
  mode?: CallMode | null;
  participants: ActiveCallParticipant[];
}
