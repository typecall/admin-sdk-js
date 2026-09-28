export interface JwtToken {
  account_id: string;
  access_token: string;
  refresh_token?: string | null;
}
