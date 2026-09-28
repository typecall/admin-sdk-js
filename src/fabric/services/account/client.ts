import type { Account } from "../../domains/account/account.js";
import { RestError, NotFoundError } from "../rest/errors.js";
import type { GetAccountResponse, RefreshTokenResponse } from "./account.js";

export type FetchFn = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

export interface AccountClientConfig {
  baseUrl: string;
  accessToken: string;
  fetch?: FetchFn;
}

export class AccountClient {
  private baseUrl: string;
  private accessToken: string;
  private fetchFn: FetchFn;
  private refreshPromise: Promise<string> | null = null;

  constructor(config: AccountClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.accessToken = config.accessToken;
    this.fetchFn = config.fetch ?? globalThis.fetch.bind(globalThis);
  }

  getToken(): string {
    return this.accessToken;
  }

  async refreshToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }
    this.refreshPromise = (async () => {
      try {
        const res = await this.fetchFn(`${this.baseUrl}/api/tokens`, {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          credentials: "include",
        });
        if (!res.ok) {
          const errorText = await res.text().catch(() => "");
          throw new Error(
            `Token refresh failed: HTTP ${res.status} ${res.statusText}: ${errorText}`,
          );
        }
        const body = (await res.json()) as RefreshTokenResponse;
        this.accessToken = body.data.access_token;
        return this.accessToken;
      } finally {
        this.refreshPromise = null;
      }
    })();
    return this.refreshPromise;
  }

  async revokeToken(): Promise<void> {
    await this.fetchFn(`${this.baseUrl}/api/tokens`, {
      method: "DELETE",
      credentials: "include",
    });
    this.accessToken = "";
  }

  /**
   * GET /api/account
   * Fetches the currently authenticated account and associated workspaces.
   * Automatically refreshes and retries once if a 401 Unauthorized is encountered.
   */
  async getAccount(): Promise<Account> {
    const doFetch = (token: string) =>
      this.fetchFn(`${this.baseUrl}/api/account`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

    let res = await doFetch(this.accessToken);

    // If 401, rotate token via the HttpOnly cookie and retry once
    if (res.status === 401) {
      const newToken = await this.refreshToken();
      res = await doFetch(newToken);
    }

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      if (res.status === 404) {
        throw new NotFoundError(res.statusText, errorText);
      }
      throw new RestError(res.status, res.statusText, errorText);
    }

    const json = (await res.json()) as GetAccountResponse;
    return json.data;
  }
}
