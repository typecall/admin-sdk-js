export type TagScope = "CallScreen" | "Contact" | "Flow";

export interface Tag {
   id: string;
   workspace_id: string;
   name: string;
   color: string;
   scopes: TagScope[];
   created_at: string;
   updated_at: string;
   deleted_at?: string | null;
}
