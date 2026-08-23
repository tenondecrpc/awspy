export class ApiError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly body: unknown;

  constructor(status: number, statusText: string, body: unknown) {
    super(`API ${status} ${statusText}`);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.body = body;
  }
}

export class ApiValidationError extends Error {
  readonly issues: unknown;

  constructor(message: string, issues: unknown) {
    super(message);
    this.name = "ApiValidationError";
    this.issues = issues;
  }
}

export class ApiResponseSizeError extends Error {
  readonly maximumBytes: number;

  constructor(maximumBytes: number) {
    super(`API response exceeded the ${maximumBytes}-byte maximum size`);
    this.name = "ApiResponseSizeError";
    this.maximumBytes = maximumBytes;
  }
}
