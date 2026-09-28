import type { CallEvent, CallLog } from "../../../domains/analytics/call.js";
import type { UtteranceLite } from "../../../domains/analytics/utterance.js";
import type { GetCallLogsRequest } from "../dto/analytics.js";
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
    const qs = query.toString();
    return this.transport.request<PaginatedCallLogsResponse>(
      `/analytics/call-logs${qs ? `?${qs}` : ""}`,
    );
  }

  listCallEvents(callLogId: string): Promise<CallEvent[]> {
    return this.transport.requestData<CallEvent[]>(
      `/analytics/call-logs/${callLogId}/events`,
    );
  }

  listCallUtterances(callLogId: string): Promise<UtteranceLite[]> {
    return this.transport.requestData<UtteranceLite[]>(
      `/analytics/call-logs/${callLogId}/utterances`,
    );
  }
}
