import type { UserAvailability, UserRole } from "../../common/user.js";

export type UserRedirectAction =
   | "EndCall"
   | "VoiceMail"
   | "User"
   | "Phone"
   | "Channel"
   | "External";

export interface User {
   id: string;
   workspace_id: string;
   account_id?: string | null;
   first_name: string;
   last_name: string;
   email: string;
   role: UserRole;
   is_active: boolean;
   avatar_path?: string | null;
   avatar_hash?: string | null;
   extension?: string | null;
   ring_duration_ms: number;
   redirect_action: UserRedirectAction;
   redirect_handle?: string | null;
   redirect_greeting_id?: string | null;
   default_channel_number_id?: string | null;
   availability: UserAvailability;
   created_at: string;
   updated_at: string;
   deleted_at?: string | null;
}
