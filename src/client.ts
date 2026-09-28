import { AdminSdkOptions, RequestOptions } from "./types";
import {
  AdminSdkError,
  ApiError,
  AuthenticationError,
  NotFoundError,
  RateLimitError,
} from "./errors";
import { AccountClient } from "./fabric/services/account/client";
import { WorkspaceRestClient } from "./fabric/services/rest/client";
import type { Account } from "./fabric/domains/account/account";

const ENVIRONMENTS = {
  production: {
    api: "https://rest.typecall.com/",
    account: "https://account.typecall.com",
  },
  development: {
    api: "https://rest.typecall.dev/",
    account: "https://account.typecall.dev",
  },
} as const;

const DEFAULT_TIMEOUT_MS = 30_000;

export class TypecallAdmin {
  private apiKey?: string;
  private accessToken?: string;
  private activeWorkspaceId?: string;
  private accountData?: Account;
  private readonly baseUrl: string;
  private readonly accountUrl: string;
  private readonly fetchFn: typeof fetch;
  private readonly timeoutMs: number;
  private readonly defaultHeaders: Record<string, string>;
  private accountClient: AccountClient;
  private restClient: WorkspaceRestClient;

  constructor(options: AdminSdkOptions = {}) {
    if (options.apiKey !== undefined && !options.apiKey.trim()) {
      throw new AdminSdkError(
        "An `apiKey` must be provided to initialize TypecallAdmin.",
      );
    }

    const env = options.environment ?? "production";
    const envDefaults = ENVIRONMENTS[env] ?? ENVIRONMENTS.production;

    this.apiKey = options.apiKey;
    this.accessToken = options.accessToken || undefined;
    this.baseUrl = (options.baseUrl ?? envDefaults.api).replace(/\/+$/, "");
    this.accountUrl = (options.accountUrl ?? envDefaults.account).replace(
      /\/+$/,
      "",
    );
    const rawFetch = options.fetch ?? globalThis.fetch;
    if (!rawFetch) {
      throw new AdminSdkError(
        "No global `fetch` found. Provide a custom `fetch` implementation in `AdminSdkOptions`.",
      );
    }
    this.fetchFn = rawFetch.bind(globalThis);
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.defaultHeaders = options.headers ?? {};

    this.accountClient = new AccountClient({
      baseUrl: this.accountUrl,
      accessToken: this.accessToken ?? "",
      fetch: this.fetchFn,
    });

    this.restClient = new WorkspaceRestClient({
      baseUrl: this.baseUrl,
      getAccessToken: () =>
        this.apiKey || this.accessToken || this.accountClient.getToken(),
      getWorkspaceId: () => this.activeWorkspaceId,
      refreshAccessToken: async () => {
        if (this.apiKey) return;
        const newToken = await this.accountClient.refreshToken();
        this.accessToken = newToken;
        return newToken;
      },
      fetch: this.fetchFn,
    });
  }

  /**
   * Sets the active workspace ID for subsequent workspace-scoped requests.
   */
  setWorkspaceId(workspaceId: string): void {
    if (this.activeWorkspaceId !== workspaceId) {
      this.activeWorkspaceId = workspaceId;
      this.restClient.clearCaches();
    }
  }

  /**
   * Returns the active workspace ID, if set.
   */
  getWorkspaceId(): string | undefined {
    return this.activeWorkspaceId;
  }

  get users() {
    return this.restClient.users;
  }
  get channels() {
    return this.restClient.channels;
  }
  get channelNumbers() {
    return this.restClient.channelNumbers;
  }
  get phones() {
    return this.restClient.phones;
  }
  get phoneNumbers() {
    return this.restClient.phoneNumbers;
  }
  get businessHours() {
    return this.restClient.businessHours;
  }
  get tags() {
    return this.restClient.tags;
  }
  get domains() {
    return this.restClient.domains;
  }
  get workspace() {
    return this.restClient.workspace;
  }
  get files() {
    return this.restClient.files;
  }
  get prompts() {
    return this.restClient.prompts;
  }
  get voices() {
    return this.restClient.voices;
  }
  get invoices() {
    return this.restClient.invoices;
  }
  get paymentMethods() {
    return this.restClient.paymentMethods;
  }
  get subscriptions() {
    return this.restClient.subscriptions;
  }
  get billing() {
    return {
      invoices: this.restClient.invoices,
      paymentMethods: this.restClient.paymentMethods,
      subscriptions: this.restClient.subscriptions,
    };
  }
  get analytics() {
    return this.restClient.analytics;
  }

  /**
   * Returns the currently cached Account, if loaded.
   */
  get account(): Account | undefined {
    return this.accountData;
  }

  /**
   * Updates the active access token and re-syncs the internal Account client.
   */
  setAccessToken(token: string): void {
    this.accessToken = token;
    this.accountClient = new AccountClient({
      baseUrl: this.accountUrl,
      accessToken: token,
      fetch: this.fetchFn,
    });
  }

  /**
   * Returns the active access token.
   */
  getAccessToken(): string | undefined {
    return this.accessToken || this.accountClient.getToken() || undefined;
  }

  async getAccount(): Promise<Account> {
    try {
      let account: Account;
      if (this.accessToken) {
        try {
          account = await this.accountClient.getAccount();
        } catch (fetchErr) {
          const newToken = await this.accountClient.refreshToken();
          this.accessToken = newToken;
          account = await this.accountClient.getAccount();
        }
      } else {
        const newToken = await this.accountClient.refreshToken();
        this.accessToken = newToken;
        account = await this.accountClient.getAccount();
      }
      this.accountData = account;
      this.accessToken = this.accountClient.getToken();
      return account;
    } catch (err: unknown) {
      throw new AuthenticationError(
        "Authentication failed: unable to fetch account or refresh token",
        err instanceof Error ? err.message : err,
      );
    }
  }

  /**
   * Signs out by revoking the current session and clearing internal state.
   */
  async logout(): Promise<void> {
    try {
      await this.accountClient.revokeToken();
    } finally {
      this.accessToken = undefined;
      this.accountData = undefined;
    }
  }

  /**
   * Helper to perform authenticated HTTP requests against the Typecall Admin API.
   */
  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const authHeader = this.apiKey
      ? `Bearer ${this.apiKey}`
      : this.accessToken
        ? `Bearer ${this.accessToken}`
        : null;

    if (!authHeader) {
      throw new AdminSdkError(
        "No authentication credentials available for this request.",
      );
    }

    const { query, headers = {}, ...init } = options;

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const url = new URL(`${this.baseUrl}${normalizedPath}`);

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      }
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.fetchFn(url.toString(), {
        ...init,
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
          Accept: "application/json",
          ...this.defaultHeaders,
          ...headers,
        },
        signal: init.signal ?? controller.signal,
      });

      if (!response.ok) {
        let errorBody: unknown;
        try {
          errorBody = await response.json();
        } catch {
          errorBody = await response.text();
        }

        switch (response.status) {
          case 401:
            throw new AuthenticationError(response.statusText, errorBody);
          case 404:
            throw new NotFoundError(response.statusText, errorBody);
          case 429: {
            const retryHeader = response.headers?.get("retry-after");
            const retryAfter = retryHeader
              ? parseInt(retryHeader, 10)
              : undefined;
            throw new RateLimitError(
              response.statusText,
              errorBody,
              retryAfter,
            );
          }
          default:
            throw new ApiError(response.status, response.statusText, errorBody);
        }
      }

      if (response.status === 204) {
        return undefined as T;
      }

      return (await response.json()) as T;
    } finally {
      clearTimeout(timer);
    }
  }
}
