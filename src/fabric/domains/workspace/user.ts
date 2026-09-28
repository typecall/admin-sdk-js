import type { EntityDeleted } from "../../common/entity.js";
import type { Handle } from "../../common/handle.js";
import type { UserAvailability, UserRole } from "../../common/user.js";

export interface EndCallSettings {
  play_greeting: boolean;
  prompt_id?: string | null;
}

export interface SendToVoicemailSettings {
  play_greeting: boolean;
  prompt_id?: string | null;
}

export interface ForwardCallSettings {
  play_greeting: boolean;
  dst_handle?: Handle | null;
  prompt_id?: string | null;
}

export type UserRedirectActionType =
  "EndCall" | "SendToVoicemail" | "ForwardCall";

export type UserRedirectAction =
  | {
      redirect_action_type: "EndCall";
      redirect_action: EndCallSettings;
    }
  | {
      redirect_action_type: "SendToVoicemail";
      redirect_action: SendToVoicemailSettings;
    }
  | {
      redirect_action_type: "ForwardCall";
      redirect_action: ForwardCallSettings;
    };

export type User = {
  id: string;
  workspace_id: string;
  account_id: string;
  first_name: string;
  last_name: string;
  email: string;
  display_name?: string | null;
  avatar_path?: string | null;
  avatar_hash?: string | null;
  role: UserRole;
  is_active: boolean;
  availability: UserAvailability;
  reset_availability_at?: string | null;
  extension?: string | null;
  ring_duration_ms: number;
  default_channel_number_id?: string | null;
  private_channel_id: string;
  joined_at: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
} & UserRedirectAction;

export type UserEventType = "Upserted" | "Deleted";

export type UserEvent =
  | { event_type: "Upserted"; payload: User }
  | { event_type: "Deleted"; payload: EntityDeleted };
