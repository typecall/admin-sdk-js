export interface Note {
  id: string;
  user_id: string;
  body: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}
