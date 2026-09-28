import type { FetchFn } from "../account/client.js";
import { RestError, NotFoundError, isNotFoundError } from "./errors.js";
import type { RestTransport } from "./client/base.js";
import { UsersClient } from "./client/users.js";
import { ChannelsClient } from "./client/channels.js";
import { ChannelNumbersClient } from "./client/channel_numbers.js";
import { PhonesClient } from "./client/phones.js";
import { PhoneNumbersClient } from "./client/phone_numbers.js";
import { BusinessHoursClient } from "./client/business_hours.js";
import { TagsClient } from "./client/tags.js";
import { DomainsClient } from "./client/domains.js";
import { WorkspaceClient } from "./client/workspace.js";
import { FilesClient } from "./client/files.js";
import { PromptsClient } from "./client/prompts.js";
import { VoicesClient } from "./client/voices.js";
import { InvoicesClient } from "./client/invoices.js";
import { PaymentMethodsClient } from "./client/payment_methods.js";
import { SubscriptionsClient } from "./client/subscriptions.js";
import { AnalyticsClient } from "./client/analytics.js";

export type RefreshTokenFn = () => Promise<string | void | undefined>;

export interface WorkspaceRestClientConfig {
  baseUrl: string;
  getAccessToken: () => string | undefined;
  getWorkspaceId: () => string | undefined;
  refreshAccessToken?: RefreshTokenFn;
  fetch?: FetchFn;
}

export class WorkspaceRestClient implements RestTransport {
  private baseUrl: string;
  private getAccessToken: () => string | undefined;
  private getWorkspaceId: () => string | undefined;
  private refreshAccessToken?: RefreshTokenFn;
  private fetchFn: FetchFn;
  private refreshPromise: Promise<string | void | undefined> | null = null;

  readonly users: UsersClient;
  readonly channels: ChannelsClient;
  readonly channelNumbers: ChannelNumbersClient;
  readonly phones: PhonesClient;
  readonly phoneNumbers: PhoneNumbersClient;
  readonly businessHours: BusinessHoursClient;
  readonly tags: TagsClient;
  readonly domains: DomainsClient;
  readonly workspace: WorkspaceClient;
  readonly files: FilesClient;
  readonly prompts: PromptsClient;
  readonly voices: VoicesClient;
  readonly invoices: InvoicesClient;
  readonly paymentMethods: PaymentMethodsClient;
  readonly subscriptions: SubscriptionsClient;
  readonly analytics: AnalyticsClient;

  constructor(config: WorkspaceRestClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.getAccessToken = config.getAccessToken;
    this.getWorkspaceId = config.getWorkspaceId;
    this.refreshAccessToken = config.refreshAccessToken;
    this.fetchFn = config.fetch ?? globalThis.fetch.bind(globalThis);

    this.users = new UsersClient(this);
    this.channels = new ChannelsClient(this);
    this.channelNumbers = new ChannelNumbersClient(this);
    this.phones = new PhonesClient(this);
    this.phoneNumbers = new PhoneNumbersClient(this);
    this.businessHours = new BusinessHoursClient(this);
    this.tags = new TagsClient(this);
    this.domains = new DomainsClient(this);
    this.workspace = new WorkspaceClient(this);
    this.files = new FilesClient(this);
    this.prompts = new PromptsClient(this);
    this.voices = new VoicesClient(this);
    this.invoices = new InvoicesClient(this);
    this.paymentMethods = new PaymentMethodsClient(this);
    this.subscriptions = new SubscriptionsClient(this);
    this.analytics = new AnalyticsClient(this);
  }

  clearCaches(): void {
    this.users.clearCache();
    this.channels.clearCache();
    this.channelNumbers.clearCache();
    this.phones.clearCache();
    this.phoneNumbers.clearCache();
    this.businessHours.clearCache();
    this.tags.clearCache();
    this.domains.clearCache();
    this.workspace.clearCache();
    this.files.clearCache();
    this.prompts.clearCache();
    this.voices.clearCache();
    this.invoices.clearCache();
    this.paymentMethods.clearCache();
    this.subscriptions.clearCache();
  }

  private async refreshToken(): Promise<string | void | undefined> {
    if (!this.refreshAccessToken) {
      return undefined;
    }
    if (!this.refreshPromise) {
      this.refreshPromise = (async () => {
        try {
          return await this.refreshAccessToken!();
        } finally {
          this.refreshPromise = null;
        }
      })();
    }
    return this.refreshPromise;
  }

  private async execute(
    path: string,
    init: RequestInit = {},
    overrideToken?: string,
    isRetry = false,
  ): Promise<Response> {
    const token = overrideToken ?? this.getAccessToken();
    const workspaceId = this.getWorkspaceId();

    const headers: Record<string, string> = {
      ...(init.body && typeof init.body === "string"
        ? { "Content-Type": "application/json" }
        : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(workspaceId ? { "X-Workspace-ID": workspaceId } : {}),
      ...((init.headers as Record<string, string>) || {}),
    };

    const res = await this.fetchFn(`${this.baseUrl}${path}`, {
      ...init,
      headers,
    });

    if (res.status === 401 && !isRetry && this.refreshAccessToken) {
      try {
        const refreshedToken = await this.refreshToken();
        const nextToken =
          typeof refreshedToken === "string" && refreshedToken.length > 0
            ? refreshedToken
            : undefined;
        return await this.execute(path, init, nextToken, true);
      } catch (refreshErr) {
        throw refreshErr;
      }
    }

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      if (res.status === 404) {
        throw new NotFoundError(res.statusText, errorText);
      }
      throw new RestError(res.status, res.statusText, errorText);
    }

    return res;
  }

  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await this.execute(path, {
      ...init,
      headers: {
        Accept: "application/json",
        ...((init.headers as Record<string, string>) || {}),
      },
    });

    if (res.status === 204) {
      return undefined as T;
    }

    return (await res.json()) as T;
  }

  async requestData<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await this.request<{ data: T }>(path, init);
    return res.data;
  }

  async requestBlob(path: string, init: RequestInit = {}): Promise<Blob> {
    const res = await this.execute(path, init);
    return res.blob();
  }
}

export { RestError, NotFoundError, isNotFoundError };
