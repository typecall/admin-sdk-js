export interface GetCallLogsRequest {
  from?: string;
  to?: string;
  status?: string[];
  category?: string[];
  page?: number;
  per_page?: number;
}
