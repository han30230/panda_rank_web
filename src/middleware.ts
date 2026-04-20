import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { SESSION_COOKIE } from "@/lib/session-constants"

function hasValidSession(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false
  try {
    const raw = decodeURIComponent(cookieValue)
    const u = JSON.parse(raw) as { id?: string; email?: string }
    return Boolean(u?.id && u?.email)
  } catch {
    return false
  }
}

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/workspace",
  "/analyze",
  "/content",
  "/reports",
  "/settings",
  "/onboarding",
] as const

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!isProtectedPath(pathname)) {
    return NextResponse.next()
  }

  const session = request.cookies.get(SESSION_COOKIE)?.value
  if (hasValidSession(session)) {
    return NextResponse.next()
  }

  const loginUrl = new URL("/login", request.url)
  const path = pathname + request.nextUrl.search
  loginUrl.searchParams.set("redirect", path)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_next/data|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
