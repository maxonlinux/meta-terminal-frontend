import { type NextRequest, NextResponse } from "next/server";

const RouteAccess = {
  PUBLIC: "PUBLIC",
  PUBLIC_ONLY: "PUBLIC_ONLY",
  PROTECTED: "PROTECTED",
} as const;

type Access = (typeof RouteAccess)[keyof typeof RouteAccess];

const routeAccess: Record<string, Access> = {
  "/trade": RouteAccess.PROTECTED,
  "/profile": RouteAccess.PROTECTED,
  "/assets": RouteAccess.PROTECTED,
  "/settings": RouteAccess.PROTECTED,
  "/tw": RouteAccess.PROTECTED,
  "/login": RouteAccess.PUBLIC_ONLY,
  "/register": RouteAccess.PUBLIC_ONLY,
  "/activate": RouteAccess.PUBLIC_ONLY,
  "/recovery": RouteAccess.PUBLIC_ONLY,
};

function getAccess(path: string): Access | undefined {
  const sorted = Object.keys(routeAccess).sort((a, b) => b.length - a.length);
  for (const prefix of sorted) {
    if (path === prefix || path.startsWith(`${prefix}/`))
      return routeAccess[prefix];
  }
  return undefined;
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get("user_token")?.value;
  const path = request.nextUrl.pathname;

  const access = getAccess(path);

  if (access === RouteAccess.PROTECTED && !token) {
    return NextResponse.redirect(new URL(`/login`, request.url));
  }
  if (access === RouteAccess.PUBLIC_ONLY && token) {
    return NextResponse.redirect(new URL(`/trade`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
