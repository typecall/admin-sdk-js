export interface CreateChannelNumberRequest {
  phone_number_id: string;
  channel_id: string;
  cid: string;
  priority: number;
  is_exclusive?: boolean;
  label?: string | null;
  user_id?: string | null;
}

export interface UpdateChannelNumberRequest {
  channel_id?: string;
  cid?: string;
  priority?: number;
  is_exclusive?: boolean;
  label?: string | null;
  user_id?: string | null;
}
