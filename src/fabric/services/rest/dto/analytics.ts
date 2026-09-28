export interface GetCallLogsRequest {
  from?: string;
  to?: string;
  status?: string[];
  category?: string[];
  user_id?: string[];
  page?: number;
  per_page?: number;
}
