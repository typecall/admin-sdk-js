export interface Domain {
   id: string;
   workspace_id: string;
   domain: string;
   verified_at?: string | null;
   created_at: string;
   updated_at: string;
   deleted_at?: string | null;
}
