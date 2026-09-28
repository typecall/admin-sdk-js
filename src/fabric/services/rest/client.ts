import type {
  ApiResponse,
  ApiCollectionResponse,
  CreateUserRequest,
  UpdateUserRequest,
  CreateChannelRequest,
  UpdateChannelRequest,
  CreateChannelNumberRequest,
  UpdateChannelNumberRequest,
  CreatePhoneRequest,
  UpdatePhoneRequest,
  PhoneConfigResponse,
  UpdatePhoneNumberRequest,
  CreateBusinessHoursRequest,
  UpdateBusinessHoursRequest,
  CreateTagRequest,
  UpdateTagRequest,
  CreateDomainRequest,
  UpdateDomainRequest,
  UpdateWorkspaceRequest,
  CreatePromptRequest,
  UpdatePromptRequest,
  FileDownloadLink,
  FileUploadLink,
  InvoicePaymentUrlResponse,
  CreatePaymentMethodUrlResponse,
  PaginateCallLogsParams,
} from "./types.js";

import type { User } from "../../domains/workspace/user.js";
import type { Channel } from "../../domains/workspace/channel.js";
import type { ChannelNumber } from "../../domains/workspace/channel-number.js";
import type { Phone } from "../../domains/workspace/phone.js";
import type { PhoneNumber } from "../../domains/workspace/phone-number.js";
import type { BusinessHours } from "../../domains/workspace/business-hours.js";
import type { Tag } from "../../domains/workspace/tag.js";
import type { Domain } from "../../domains/workspace/domain.js";
import type { WorkspaceBillingProfile } from "../../domains/workspace/workspace.js";
import type { Prompt } from "../../domains/workspace/prompt.js";
import type { Voice } from "../../domains/workspace/voice.js";
import type {
  Invoice,
  PaymentMethod,
  Subscription,
} from "../../domains/workspace/billing.js";
import type { FetchFn } from "../account/client.js";

export interface WorkspaceRestClientConfig {
  baseUrl: string;
  getAccessToken: () => string | undefined;
  getWorkspaceId: () => string | undefined;
  fetch?: FetchFn;
}

export class WorkspaceRestClient {
  private baseUrl: string;
  private getAccessToken: () => string | undefined;
  private getWorkspaceId: () => string | undefined;
  private fetchFn: FetchFn;

  constructor(config: WorkspaceRestClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.getAccessToken = config.getAccessToken;
    this.getWorkspaceId = config.getWorkspaceId;
    this.fetchFn = config.fetch ?? globalThis.fetch.bind(globalThis);
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = this.getAccessToken();
    const workspaceId = this.getWorkspaceId();

    const headers: Record<string, string> = {
      Accept: "application/json",
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

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText}: ${errorText}`);
    }

    if (res.status === 204) {
      return undefined as T;
    }

    return (await res.json()) as T;
  }

  // --- Users ---
  readonly users = {
    list: () => this.request<ApiCollectionResponse<User>>("/users"),
    get: (id: string) => this.request<ApiResponse<User>>(`/users/${id}`),
    create: (data: CreateUserRequest) =>
      this.request<ApiResponse<User>>("/users", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: UpdateUserRequest) =>
      this.request<ApiResponse<User>>(`/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      this.request<void>(`/users/${id}`, { method: "DELETE" }),
  };

  // --- Channels ---
  readonly channels = {
    list: () => this.request<ApiCollectionResponse<Channel>>("/channels"),
    get: (id: string) => this.request<ApiResponse<Channel>>(`/channels/${id}`),
    create: (data: CreateChannelRequest) =>
      this.request<ApiResponse<Channel>>("/channels", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: UpdateChannelRequest) =>
      this.request<ApiResponse<Channel>>(`/channels/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      this.request<void>(`/channels/${id}`, { method: "DELETE" }),
  };

  // --- Channel Numbers ---
  readonly channelNumbers = {
    list: () =>
      this.request<ApiCollectionResponse<ChannelNumber>>("/channel-numbers"),
    get: (id: string) =>
      this.request<ApiResponse<ChannelNumber>>(`/channel-numbers/${id}`),
    create: (data: CreateChannelNumberRequest) =>
      this.request<ApiResponse<ChannelNumber>>("/channel-numbers", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: UpdateChannelNumberRequest) =>
      this.request<ApiResponse<ChannelNumber>>(`/channel-numbers/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      this.request<void>(`/channel-numbers/${id}`, { method: "DELETE" }),
  };

  // --- Phones ---
  readonly phones = {
    list: () => this.request<ApiCollectionResponse<Phone>>("/phones"),
    get: (id: string) => this.request<ApiResponse<Phone>>(`/phones/${id}`),
    getConfig: (id: string) =>
      this.request<PhoneConfigResponse>(`/phones/${id}/config`),
    create: (data: CreatePhoneRequest) =>
      this.request<ApiResponse<Phone>>("/phones", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: UpdatePhoneRequest) =>
      this.request<ApiResponse<Phone>>(`/phones/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      this.request<void>(`/phones/${id}`, { method: "DELETE" }),
  };

  // --- Phone Numbers ---
  readonly phoneNumbers = {
    list: () =>
      this.request<ApiCollectionResponse<PhoneNumber>>("/phone-numbers"),
    get: (id: string) =>
      this.request<ApiResponse<PhoneNumber>>(`/phone-numbers/${id}`),
    update: (id: string, data: UpdatePhoneNumberRequest) =>
      this.request<ApiResponse<PhoneNumber>>(`/phone-numbers/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  };

  // --- Business Hours ---
  readonly businessHours = {
    list: () =>
      this.request<ApiCollectionResponse<BusinessHours>>("/business-hours"),
    get: (id: string) =>
      this.request<ApiResponse<BusinessHours>>(`/business-hours/${id}`),
    create: (data: CreateBusinessHoursRequest) =>
      this.request<ApiResponse<BusinessHours>>("/business-hours", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: UpdateBusinessHoursRequest) =>
      this.request<ApiResponse<BusinessHours>>(`/business-hours/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      this.request<void>(`/business-hours/${id}`, { method: "DELETE" }),
  };

  // --- Tags ---
  readonly tags = {
    list: () => this.request<ApiCollectionResponse<Tag>>("/tags"),
    get: (id: string) => this.request<ApiResponse<Tag>>(`/tags/${id}`),
    create: (data: CreateTagRequest) =>
      this.request<ApiResponse<Tag>>("/tags", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: UpdateTagRequest) =>
      this.request<ApiResponse<Tag>>(`/tags/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      this.request<void>(`/tags/${id}`, { method: "DELETE" }),
  };

  // --- Domains ---
  readonly domains = {
    list: () => this.request<ApiCollectionResponse<Domain>>("/domains"),
    get: (id: string) => this.request<ApiResponse<Domain>>(`/domains/${id}`),
    create: (data: CreateDomainRequest) =>
      this.request<ApiResponse<Domain>>("/domains", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: UpdateDomainRequest) =>
      this.request<ApiResponse<Domain>>(`/domains/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      this.request<void>(`/domains/${id}`, { method: "DELETE" }),
  };

  // --- Workspace ---
  readonly workspace = {
    get: () => this.request<ApiResponse<WorkspaceBillingProfile>>("/workspace"),
    update: (data: UpdateWorkspaceRequest) =>
      this.request<ApiResponse<WorkspaceBillingProfile>>("/workspace", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  };

  // --- Files ---
  readonly files = {
    getDownloadLink: (path: string) =>
      this.request<ApiResponse<FileDownloadLink>>("/files/link/download", {
        headers: { "X-File-Path": path },
      }),
    getUploadLink: (
      category: string,
      entityId?: string,
      extension?: string,
    ) => {
      const params = new URLSearchParams({ category });
      if (entityId) params.append("entity_id", entityId);
      if (extension) params.append("extension", extension);
      return this.request<ApiResponse<FileUploadLink>>(
        `/files/link/upload?${params.toString()}`,
      );
    },
  };

  // --- Prompts ---
  readonly prompts = {
    list: () => this.request<ApiCollectionResponse<Prompt>>("/prompts"),
    my: () => this.request<ApiCollectionResponse<Prompt>>("/prompts/my"),
    get: (id: string) => this.request<ApiResponse<Prompt>>(`/prompts/${id}`),
    create: (data: CreatePromptRequest) =>
      this.request<ApiResponse<Prompt>>("/prompts", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: UpdatePromptRequest) =>
      this.request<ApiResponse<Prompt>>(`/prompts/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      this.request<void>(`/prompts/${id}`, { method: "DELETE" }),
  };

  // --- Voices ---
  readonly voices = {
    list: () => this.request<ApiCollectionResponse<Voice>>("/voices"),
    get: (id: string) => this.request<ApiResponse<Voice>>(`/voices/${id}`),
    synthesize: async (id: string, ssml: string): Promise<Blob> => {
      const token = this.getAccessToken();
      const workspaceId = this.getWorkspaceId();
      const res = await this.fetchFn(
        `${this.baseUrl}/voices/${id}/tts/synthesize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(workspaceId ? { "X-Workspace-ID": workspaceId } : {}),
          },
          body: JSON.stringify({ ssml }),
        },
      );
      if (!res.ok) {
        throw new Error(`Voice synthesis failed: HTTP ${res.status}`);
      }
      return res.blob();
    },
  };

  // --- Billing ---
  readonly billing = {
    invoices: () => this.request<ApiCollectionResponse<Invoice>>("/invoices"),
    invoicePaymentUrl: (id: string) =>
      this.request<InvoicePaymentUrlResponse>(`/invoices/${id}/payment-url`),
    paymentMethods: () =>
      this.request<ApiCollectionResponse<PaymentMethod>>("/payment-methods"),
    createPaymentMethodUrl: () =>
      this.request<CreatePaymentMethodUrlResponse>(
        "/payment-methods/create-url",
      ),
    deletePaymentMethod: (id: string) =>
      this.request<void>(`/payment-methods/${id}`, { method: "DELETE" }),
    setPaymentMethodAsPrimary: (id: string) =>
      this.request<ApiResponse<PaymentMethod>>(
        `/payment-methods/${id}/set-as-primary`,
        { method: "POST" },
      ),
    subscription: () =>
      this.request<ApiResponse<Subscription>>("/subscription"),
  };

  // --- Analytics ---
  readonly analytics = {
    callLogs: (params: PaginateCallLogsParams = {}) => {
      const query = new URLSearchParams();
      if (params.from) query.append("from", params.from);
      if (params.to) query.append("to", params.to);
      if (params.page) query.append("page", String(params.page));
      if (params.per_page) query.append("per_page", String(params.per_page));
      if (params.status) {
        params.status.forEach((s) => query.append("status[]", s));
      }
      if (params.category) {
        params.category.forEach((c) => query.append("category[]", c));
      }
      const qs = query.toString();
      return this.request<any>(`/analytics/call-logs${qs ? `?${qs}` : ""}`);
    },
    callEvents: (callLogId: string) =>
      this.request<ApiResponse<any[]>>(
        `/analytics/call-logs/${callLogId}/events`,
      ),
    callUtterances: (callLogId: string) =>
      this.request<ApiResponse<any[]>>(
        `/analytics/call-logs/${callLogId}/utterances`,
      ),
  };
}
