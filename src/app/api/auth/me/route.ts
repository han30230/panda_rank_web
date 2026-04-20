import { NextResponse } from "next/server"

import {
  GUEST_USER_ID,
  getSessionWithUser,
  isGuestUserRecord,
  randomSessionToken,
  sessionExpiresAt,
} from "@/lib/auth-server"
import { setSessionCookie } from "@/lib/cookie-session"
import { prisma } from "@/lib/prisma"

export async function GET() {
  let session = await getSessionWithUser()

  if (!session) {
    const guest = await prisma.user.findUnique({ where: { id: GUEST_USER_ID } })
    if (!guest) {
      return NextResponse.json(
        { error: "데이터베이스가 초기화되지 않았습니다. npm run db:push && npm run db:seed 를 실행하세요." },
        { status: 500 },
      )
    }
    const token = randomSessionToken()
    await prisma.session.create({
      data: {
        userId: guest.id,
        token,
        expiresAt: sessionExpiresAt(),
      },
    })
    const res = NextResponse.json({
      user: {
        id: guest.id,
        email: guest.email,
        name: guest.name,
        isGuest: true,
      },
    })
    setSessionCookie(res, token)
    return res
  }

  const u = session.user
  return NextResponse.json({
    user: {
      id: u.id,
      email: u.email,
      name: u.name,
      isGuest: isGuestUserRecord(u),
    },
  })
}
