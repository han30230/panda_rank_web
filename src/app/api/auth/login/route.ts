import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { z } from "zod"

import { getSessionWithUser, randomSessionToken, sessionExpiresAt } from "@/lib/auth-server"
import { GUEST_USER_ID } from "@/lib/guest-user"
import { setSessionCookie } from "@/lib/cookie-session"
import { prisma } from "@/lib/prisma"
import { userToSessionUser } from "@/lib/session-user"
import { loginSchema } from "@/lib/validators"

export async function POST(req: Request) {
  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 })
  }

  const parsed = loginSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const e = parsed.data.email.trim().toLowerCase()
  const user = await prisma.user.findUnique({ where: { email: e } })
  if (!user || user.id === GUEST_USER_ID) {
    return NextResponse.json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." }, { status: 401 })
  }

  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash)
  if (!ok) {
    return NextResponse.json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." }, { status: 401 })
  }

  const prev = await getSessionWithUser()
  if (prev) {
    await prisma.session.delete({ where: { id: prev.id } }).catch(() => {})
  }

  const token = randomSessionToken()
  await prisma.session.create({
    data: { userId: user.id, token, expiresAt: sessionExpiresAt() },
  })

  const res = NextResponse.json({
    user: userToSessionUser(user),
  })
  setSessionCookie(res, token)
  return res
}
