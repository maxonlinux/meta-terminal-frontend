export function wsBaseFromWindow(): string | null {
  if (typeof window === "undefined") return null;
  return window.location.origin.replace(/^http/, "ws");
}

function stripTrailingSlash(s: string): string {
  return s.endsWith("/") ? s.slice(0, -1) : s;
}

export function wsUrl(params: {
  base: string | null;
  path: string;
}): string | null {
  const base = params.base ? stripTrailingSlash(params.base) : null;
  if (!base) return null;
  const path = params.path.startsWith("/") ? params.path : `/${params.path}`;
  return `${base}${path}`;
}
