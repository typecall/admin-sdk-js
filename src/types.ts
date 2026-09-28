export type TypecallEnvironment = "production" | "development";

export interface AdminSdkOptions {
  /**
   * API key used to authenticate server-to-server requests with the Typecall Admin API.
   */
  apiKey?: string;

  /**
   * Access token (JWT) used for user / browser session authentication.
   */
  accessToken?: string;

  /**
   * Environment preset to use. Defaults to "production".
   * - "production": https://rest.typecall.com and https://account.typecall.com
   * - "development": https://rest.typecall.dev and https://account.typecall.dev
   * @default "production"
   */
  environment?: TypecallEnvironment;

  /**
   * Base URL for the Typecall Admin API.
   * If not provided, defaults to the URL for the selected environment.
   */
  baseUrl?: string;

  /**
   * Base URL for the Typecall Account Service.
   * If not provided, defaults to the URL for the selected environment.
   */
  accountUrl?: string;

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
