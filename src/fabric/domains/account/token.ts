/**
 * Client-side JWT session token representation.
 * refresh_token is excluded as it is stored and managed via HttpOnly session cookies in browsers.
 */
export interface JwtToken {
   account_id: string;
   access_token: string;
}
