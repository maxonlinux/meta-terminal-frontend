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

export async function requestJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<{ res: Response; body: T | null }> {
  const res = await fetch(input, init);
  let body: T | null = null;
  try {
    body = (await res.json()) as T;
  } catch {
    body = null;
  }
  return { res, body };
}
