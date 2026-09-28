import type { Account } from "../../domains/account/account.js";

export interface GetAccountRequest {}

export interface GetAccountResponse {
   data: Account;
}

export type AccountResponse = GetAccountResponse;

export interface RefreshTokenRequest {}

export interface RefreshTokenData {
   access_token: string;
}

export interface RefreshTokenResponse {
   data: RefreshTokenData;
}

export interface RevokeTokenRequest {}

export interface RevokeTokenResponse {}
