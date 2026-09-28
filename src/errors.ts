export class AdminSdkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminSdkError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ApiError extends AdminSdkError {
  readonly status: number;
  readonly statusText: string;
  readonly body: unknown;

  constructor(status: number, statusText: string, body: unknown) {
    super(`API request failed with status ${status} (${statusText})`);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.body = body;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AuthenticationError extends ApiError {
  constructor(statusText: string, body: unknown) {
    super(401, statusText, body);
    this.name = "AuthenticationError";
  }
}

export class NotFoundError extends ApiError {
  constructor(statusText: string, body: unknown) {
    super(404, statusText, body);
    this.name = "NotFoundError";
  }
}

export class RateLimitError extends ApiError {
  readonly retryAfterSeconds?: number;

  constructor(statusText: string, body: unknown, retryAfterSeconds?: number) {
    super(429, statusText, body);
    this.name = "RateLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}
