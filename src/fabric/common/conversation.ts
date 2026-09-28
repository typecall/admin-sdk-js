export type ConversationUserRole = "Admin" | "Member" | "Guest";

export interface ConversationTypingStarted {
  conversation_id: string;
  thread_handle?: string | null;
  participant_handle: string;
}

export interface ConversationTypingStopped {
  conversation_id: string;
  thread_handle?: string | null;
  participant_handle: string;
}
