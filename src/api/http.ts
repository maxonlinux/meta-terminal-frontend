export const API_BASE = "/api/v1";

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

type FetchParams = RequestInit & {
  query?: Record<string, string | number | boolean | undefined>;
};

function buildQuery(query?: FetchParams["query"]) {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function apiFetch(path: string, params: FetchParams = {}) {
  const { query, ...init } = params;
  const url = `${API_BASE}${path}${buildQuery(query)}`;
  const isFormData =
    typeof FormData !== "undefined" && init.body instanceof FormData;
  const res = await fetch(url, {
    ...init,
    credentials: "include",
    cache: "no-store",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...init.headers,
    },
  });
  return res;
}

export async function apiJson<T>(
  path: string,
  params: FetchParams = {},
): Promise<T> {
  const res = await apiFetch(path, params);
  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      body = null;
    }
    const code =
      typeof body === "object" && body && "error" in body
        ? String((body as { error: string }).error)
        : `HTTP_${res.status}`;
    throw new ApiError({ status: res.status, code, body });
  }
  return (await res.json()) as T;
}
