import { randomBytes } from "crypto"
import { NextResponse } from "next/server"
import { z } from "zod"

import { GUEST_USER_ID } from "@/lib/guest-user"
import { prisma } from "@/lib/prisma"
import { emailSchema } from "@/lib/validators"

const bodySchema = z.object({
  email: emailSchema,
})

const RESET_HOURS = 1

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

  const email = parsed.data.email.trim().toLowerCase()
  const user = await prisma.user.findUnique({ where: { email } })

  const generic = {
    ok: true as const,
    message: "요청을 접수했습니다. 등록된 이메일이면 재설정 안내가 발송됩니다.",
  }

  if (!user || user.id === GUEST_USER_ID || user.email === "guest@local") {
    return NextResponse.json(generic)
  }

  const token = randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + RESET_HOURS * 60 * 60 * 1000)

  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } })
  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt },
  })

  const resetPath = `/reset-password?token=${encodeURIComponent(token)}`

  return NextResponse.json({
    ...generic,
    ...(process.env.PASSWORD_RESET_DEV_LINK === "true" ? { devResetPath: resetPath } : {}),
  })
}
