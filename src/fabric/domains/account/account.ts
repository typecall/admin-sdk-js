import type { UserAvailability, UserRole } from "../../common/user.js";

export interface AccountWorkspace {
   id: string;
   name: string;
   avatar_path?: string | null;
   avatar_hash?: string | null;
   user_id: string;
   user_role: UserRole;
   is_active: boolean;
   joined_at: string;
}

export interface Account {
   id: string;
   first_name: string;
   last_name: string;
   email: string;
   avatar_path?: string | null;
   avatar_hash?: string | null;
   availability: UserAvailability;
   reset_availability_at?: string | null;
   email_verified_at?: string | null;
   max_mobile_devices: number;
   max_desktop_devices: number;
   workspaces: AccountWorkspace[];
   created_at: string;
   updated_at: string;
   deleted_at?: string | null;
}
