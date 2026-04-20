import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { z } from "zod"

import { getSessionWithUser, randomSessionToken, sessionExpiresAt } from "@/lib/auth-server"
import { setSessionCookie } from "@/lib/cookie-session"
import { prisma } from "@/lib/prisma"
import { userToSessionUser } from "@/lib/session-user"
import { emailSchema } from "@/lib/validators"

const bodySchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: emailSchema,
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
})

export async function POST(req: Request) {
  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const { name, email, password } = parsed.data
  const e = email.trim().toLowerCase()
  if (e === "guest@local") {
    return NextResponse.json({ error: "이 이메일은 사용할 수 없습니다." }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email: e } })
  if (existing) {
    return NextResponse.json({ error: "이미 가입된 이메일입니다." }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      email: e,
      name: name.trim(),
      passwordHash,
    },
  })

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
