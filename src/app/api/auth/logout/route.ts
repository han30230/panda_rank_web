import { NextResponse } from "next/server"

import { getSessionWithUser, randomSessionToken, sessionExpiresAt } from "@/lib/auth-server"
import { GUEST_USER_ID } from "@/lib/guest-user"
import { setSessionCookie } from "@/lib/cookie-session"
import { prisma } from "@/lib/prisma"
import { userToSessionUser } from "@/lib/session-user"

export async function POST() {
  const prev = await getSessionWithUser()
  if (prev) {
    await prisma.session.delete({ where: { id: prev.id } }).catch(() => {})
  }

  const guest = await prisma.user.findUnique({ where: { id: GUEST_USER_ID } })
  if (!guest) {
    return NextResponse.json({ error: "서버 설정 오류" }, { status: 500 })
  }

  const token = randomSessionToken()
  await prisma.session.create({
    data: { userId: guest.id, token, expiresAt: sessionExpiresAt() },
  })

  const res = NextResponse.json({
    user: userToSessionUser(guest),
  })
  setSessionCookie(res, token)
  return res
}
