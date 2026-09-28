import { AdminSdkOptions, RequestOptions } from "./types";
import {
   AdminSdkError,
   ApiError,
   AuthenticationError,
   NotFoundError,
   RateLimitError,
} from "./errors";

const DEFAULT_BASE_URL = "https://api.typecall.com/v1";
const DEFAULT_TIMEOUT_MS = 30_000;

export class TypecallAdmin {
   private readonly apiKey: string;
   private readonly baseUrl: string;
   private readonly fetchFn: typeof fetch;
   private readonly timeoutMs: number;
   private readonly defaultHeaders: Record<string, string>;

   constructor(options: AdminSdkOptions) {
      if (!options?.apiKey) {
         throw new AdminSdkError(
            "An `apiKey` must be provided to initialize TypecallAdmin.",
         );
      }

      this.apiKey = options.apiKey;
      this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
      this.fetchFn = options.fetch ?? globalThis.fetch;
      this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
      this.defaultHeaders = options.headers ?? {};

      if (!this.fetchFn) {
         throw new AdminSdkError(
            "No global `fetch` found. Provide a custom `fetch` implementation in `AdminSdkOptions`.",
         );
      }
   }

   /**
    * Helper to perform authenticated HTTP requests against the Typecall Admin API.
    */
   async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
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
               Authorization: `Bearer ${this.apiKey}`,
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
                  throw new ApiError(
                     response.status,
                     response.statusText,
                     errorBody,
                  );
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
