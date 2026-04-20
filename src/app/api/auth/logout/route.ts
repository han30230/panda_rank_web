import { NextResponse } from "next/server"

import {
  GUEST_USER_ID,
  getSessionWithUser,
  randomSessionToken,
  sessionExpiresAt,
} from "@/lib/auth-server"
import { setSessionCookie } from "@/lib/cookie-session"
import { prisma } from "@/lib/prisma"

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
