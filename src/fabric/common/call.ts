export type CallStatus =
  | "Connecting"
  | "Ringing"
  | "InProgress"
  | "Completed";

export type CallOutcome =
  | "Answered"
  | "Busy"
  | "DoNotDisturb"
  | "Abandoned"
  | "Missed"
  | "NotConnected"
  | "Voicemail"
  | "Unreachable";

export type CallCategory = "Incoming" | "Outgoing" | "Team";

export type CallDirection = "Incoming" | "Outgoing";

export type CallRecordingMode = "Off" | "On" | "OffForced" | "OnForced";

export type CallTransferKind = "Quick" | "Safe" | "Announced";

export type CallTransferStatus =
  | "Initiating"
  | "Announcing"
  | "Connecting"
  | "Canceled"
  | "Failed"
  | "Completed";

export type CallSupervisionMode = "Monitor" | "Whisper";

export type CallDisconnectedReason =
  | "Completed"
  | "Abandoned"
  | "AnsweredElsewhere"
  | "Busy"
  | "DoNotDisturb"
  | "Missed"
  | "Unreachable";

export type CallConversationType = "Channel" | "Chat";
