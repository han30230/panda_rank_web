import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/** 인증 없이 모든 경로 허용 — 로컬 데모는 클라이언트에서 게스트 세션을 둡니다. */
export function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_next/data|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
