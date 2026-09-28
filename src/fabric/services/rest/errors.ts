export class RestError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly body?: string;

  constructor(status: number, statusText: string, body?: string) {
    super(`HTTP ${status} ${statusText}: ${body ?? ""}`);
    this.name = "RestError";
    this.status = status;
    this.statusText = statusText;
    this.body = body;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends RestError {
  constructor(statusText: string = "Not Found", body?: string) {
    super(404, statusText, body);
    this.name = "NotFoundError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function isNotFoundError(error: unknown): error is NotFoundError {
  if (error instanceof NotFoundError) {
    return true;
  }
  if (error instanceof RestError && error.status === 404) {
    return true;
  }
  if (
    typeof error === "object" &&
    error !== null &&
    (error as { status?: number }).status === 404
  ) {
    return true;
  }
  return false;
}
