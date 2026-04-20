import { NextResponse } from "next/server"

import { getSessionWithUser, randomSessionToken, sessionExpiresAt } from "@/lib/auth-server"
import { GUEST_USER_ID } from "@/lib/guest-user"
import { setSessionCookie } from "@/lib/cookie-session"
import { prisma } from "@/lib/prisma"
import { userToSessionUser } from "@/lib/session-user"

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
      user: userToSessionUser(guest),
    })
    setSessionCookie(res, token)
    return res
  }

  return NextResponse.json({
    user: userToSessionUser(session.user),
  })
}
