export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly body: unknown;

  constructor(params: { status: number; code: string; body: unknown }) {
    super(params.code);
    this.name = "ApiError";
    this.status = params.status;
    this.code = params.code;
    this.body = params.body;
  }
}
