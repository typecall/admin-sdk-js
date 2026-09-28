export interface AdminSdkOptions {
  /**
   * API key used to authenticate requests with the Typecall Admin API.
   */
  apiKey: string;

  /**
   * Base URL for the Typecall Admin API.
   * @default "https://api.typecall.com/v1"
   */
  baseUrl?: string;

  /**
   * Optional custom fetch implementation (defaults to global fetch).
   */
  fetch?: typeof fetch;

  /**
   * Request timeout in milliseconds.
   * @default 30000
   */
  timeoutMs?: number;

  /**
   * Additional default headers to send with every request.
   */
  headers?: Record<string, string>;
}

export interface RequestOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined>;
}
