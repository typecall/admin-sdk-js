import type { CallEvent, CallLog } from "../../../domains/analytics/call.js";
import type { UtteranceLite } from "../../../domains/analytics/utterance.js";
import type { GetCallLogsRequest } from "../dto/analytics.js";
import { isNotFoundError } from "../errors.js";
import { BaseResourceClient } from "./base.js";

export interface PaginatedCallLogsResponse {
  data: CallLog[];
  links?: {
    first?: string | null;
    last?: string | null;
    prev?: string | null;
    next?: string | null;
  };
  meta?: {
    current_page: number;
    from?: number | null;
    last_page: number;
    per_page: number;
    to?: number | null;
    total: number;
  };
}

export class AnalyticsClient extends BaseResourceClient {
  listCallLogs(
    params: GetCallLogsRequest = {},
  ): Promise<PaginatedCallLogsResponse> {
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
    if (params.user_id) {
      params.user_id.forEach((u) => query.append("user_id[]", u));
    }
    const qs = query.toString();
    const queryString = qs ? `?${qs}` : "";

    return this.transport
      .request<PaginatedCallLogsResponse>(`/analytics/call-logs${queryString}`)
      .catch((err) => {
        if (isNotFoundError(err)) {
          return this.transport.request<PaginatedCallLogsResponse>(
            `/reports/call-logs${queryString}`,
          );
        }
        throw err;
      });
  }

  async listCallEvents(callLogId: string): Promise<CallEvent[]> {
    return this.transport
      .requestData<CallEvent[]>(`/analytics/call-logs/${callLogId}/events`)
      .catch((err) => {
        if (isNotFoundError(err)) {
          return this.transport.requestData<CallEvent[]>(
            `/reports/call-logs/${callLogId}/events`,
          );
        }
        throw err;
      });
  }

  listCallUtterances(callLogId: string): Promise<UtteranceLite[]> {
    return this.transport.requestData<UtteranceLite[]>(
      `/analytics/call-logs/${callLogId}/utterances`,
    );
  }
}
